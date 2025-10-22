// Firebase Integration for Ashlyn Retreat App
// Provides authentication and real-time database sync

const FirebaseSync = {
    initialized: false,
    user: null,
    db: null,
    auth: null,
    syncEnabled: false,
    offlineMode: false, // Flag to track if user explicitly chose offline mode
    listeners: [],

    // Initialize Firebase
    async init() {
        if (!window.firebaseFeatures.enabled) {
            console.log('Firebase disabled in config. Using localStorage only.');
            return false;
        }

        try {
            // Initialize Firebase
            firebase.initializeApp(window.firebaseConfig);
            this.auth = firebase.auth();
            this.db = firebase.database();

            // Enable offline persistence
            if (window.firebaseFeatures.offlineSupport) {
                this.db.goOffline();
                this.db.goOnline();
            }

            // Set up auth state listener
            this.auth.onAuthStateChanged((user) => {
                this.handleAuthStateChange(user);
            });

            this.initialized = true;
            console.log('Firebase initialized successfully');
            return true;
        } catch (error) {
            console.error('Firebase initialization failed:', error);
            return false;
        }
    },

    // Handle authentication state changes
    handleAuthStateChange(user) {
        this.user = user;

        if (user) {
            console.log('User logged in:', user.email);
            this.syncEnabled = true;
            this.showApp();

            // Initialize app after authentication
            if (window.initializeApp) {
                window.initializeApp();
            }
            this.startSync();

            // Trigger sync on login
            this.pullAllData();
        } else {
            console.log('User logged out');
            this.syncEnabled = false;
            this.showAuth();
            this.stopSync();
        }

        // Notify app of auth state change
        if (window.onAuthStateChanged) {
            window.onAuthStateChanged(user);
        }
    },

    // Sign up new user
    async signUp(email, password, displayName) {
        try {
            const credential = await this.auth.createUserWithEmailAndPassword(email, password);

            // Update profile
            await credential.user.updateProfile({
                displayName: displayName
            });

            // Initialize user data in database
            await this.db.ref(`users/${credential.user.uid}`).set({
                email: email,
                displayName: displayName,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                userData: {}
            });

            return { success: true, user: credential.user };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign in existing user
    async signIn(email, password) {
        try {
            const credential = await this.auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: credential.user };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    },

    // Sign out
    async signOut() {
        try {
            await this.auth.signOut();
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get current user
    getCurrentUser() {
        return this.user;
    },

    // Check if user is authenticated
    isAuthenticated() {
        return this.user !== null;
    },

    // Keys that should be stored in shared workspace (not user-specific)
    sharedDataKeys: [
        'ashlyn_retreat_supplies',
        'ashlyn_retreat_swot',
        'ashlyn_retreat_ikigai',
        'ashlyn_retreat_value_prop',
        'ashlyn_retreat_kanban',
        'ashlyn_retreat_action_plan'
    ],

    // Check if a key should use shared workspace
    isSharedData(key) {
        return this.sharedDataKeys.includes(key);
    },

    // Get user data reference (for user-specific data like journals)
    getUserDataRef(path = '') {
        if (!this.user) return null;
        const basePath = `users/${this.user.uid}/userData`;
        return path ? this.db.ref(`${basePath}/${path}`) : this.db.ref(basePath);
    },

    // Get shared workspace reference (for shared data like business tools)
    getSharedDataRef(path = '') {
        if (!this.user) return null;
        // Use a shared workspace ID - you can customize this (e.g., retreat group ID)
        // For now, using a simple shared space for the retreat
        const basePath = 'shared/ashlyn_retreat';
        return path ? this.db.ref(`${basePath}/${path}`) : this.db.ref(basePath);
    },

    // Get appropriate reference based on data type
    getDataRef(key) {
        return this.isSharedData(key) ? this.getSharedDataRef(key) : this.getUserDataRef(key);
    },

    // Save data to Firebase
    async saveData(key, data) {
        if (!this.syncEnabled || !this.user) {
            return false;
        }

        try {
            const ref = this.getDataRef(key);
            await ref.set({
                data: data,
                updatedAt: firebase.database.ServerValue.TIMESTAMP,
                updatedBy: this.user.email
            });
            console.log(`✅ Saved ${key} to ${this.isSharedData(key) ? 'shared' : 'user'} workspace`);
            return true;
        } catch (error) {
            console.error('Firebase save error:', error);
            return false;
        }
    },

    // Load data from Firebase
    async loadData(key) {
        if (!this.syncEnabled || !this.user) {
            return null;
        }

        try {
            const ref = this.getDataRef(key);
            const snapshot = await ref.once('value');

            if (snapshot.exists()) {
                const result = snapshot.val();
                console.log(`✅ Loaded ${key} from ${this.isSharedData(key) ? 'shared' : 'user'} workspace`);
                return result.data;
            }
            return null;
        } catch (error) {
            console.error('Firebase load error:', error);
            return null;
        }
    },

    // Listen for real-time updates
    listenToData(key, callback) {
        if (!this.syncEnabled || !this.user) {
            return null;
        }

        const ref = this.getDataRef(key);

        // Track if this is the first load to avoid triggering on initial sync
        let isFirstLoad = true;

        const listener = ref.on('value', (snapshot) => {
            if (snapshot.exists()) {
                const result = snapshot.val();

                // Skip first load to avoid duplicate initial sync
                if (isFirstLoad) {
                    isFirstLoad = false;
                    return;
                }

                callback(result.data);
            }
        });

        this.listeners.push({ ref, listener });
        return listener;
    },

    // Stop listening to a specific key
    stopListening(key) {
        const ref = this.getDataRef(key);
        ref.off();
        this.listeners = this.listeners.filter(l => l.ref !== ref);
    },

    // Stop all listeners
    stopAllListeners() {
        this.listeners.forEach(({ ref }) => {
            ref.off();
        });
        this.listeners = [];
    },

    // Sync localStorage data to Firebase
    async pushAllData() {
        if (!this.syncEnabled || !this.user) {
            return false;
        }

        try {
            // Get all localStorage keys for this app
            const keysToSync = Object.values(Storage.keys);

            for (const key of keysToSync) {
                const localData = Storage.load(key);
                if (localData !== null) {
                    await this.saveData(key, localData);
                }
            }

            console.log('All data pushed to Firebase');
            return true;
        } catch (error) {
            console.error('Push all data error:', error);
            return false;
        }
    },

    // Pull all data from Firebase to localStorage
    async pullAllData() {
        if (!this.syncEnabled || !this.user) {
            return false;
        }

        try {
            const keysToSync = Object.values(Storage.keys);

            for (const key of keysToSync) {
                const firebaseData = await this.loadData(key);
                // Only save if data exists and is not undefined
                if (firebaseData !== null && firebaseData !== undefined) {
                    // Skip Firebase sync to prevent loop
                    Storage.save(key, firebaseData, true);
                }
            }

            console.log('All data pulled from Firebase');

            // Refresh UI
            if (window.onDataSynced) {
                window.onDataSynced();
            }

            return true;
        } catch (error) {
            console.error('Pull all data error:', error);
            return false;
        }
    },

    // Sync specific key between localStorage and Firebase
    async syncKey(key) {
        if (!this.syncEnabled || !this.user) {
            return false;
        }

        try {
            // Get both versions
            const localData = Storage.load(key);
            const firebaseData = await this.loadData(key);

            // If both exist, use most recent (or merge if needed)
            // For simplicity, we'll use Firebase as source of truth
            if (firebaseData !== null && firebaseData !== undefined) {
                // Skip Firebase sync to prevent loop
                Storage.save(key, firebaseData, true);
            } else if (localData !== null) {
                await this.saveData(key, localData);
            }

            return true;
        } catch (error) {
            console.error('Sync key error:', error);
            return false;
        }
    },

    // Start automatic sync
    startSync() {
        if (!window.firebaseFeatures.autoSync) return;

        // Set up real-time listeners for all keys
        Object.values(Storage.keys).forEach(key => {
            this.listenToData(key, (data) => {
                // Update localStorage when Firebase changes
                // Pass skipFirebaseSync=true to prevent infinite loop
                Storage.save(key, data, true);

                // Refresh UI
                if (window.onDataSynced) {
                    window.onDataSynced();
                }
            });
        });

        console.log('Real-time sync started');
    },

    // Stop automatic sync
    stopSync() {
        this.stopAllListeners();
        console.log('Real-time sync stopped');
    },

    // Show authentication UI
    showAuth() {
        // Don't show auth modal if user explicitly chose offline mode
        if (this.offlineMode) {
            console.log('Offline mode active - not showing auth modal');
            return;
        }

        const authModal = document.getElementById('authModal');
        const appContent = document.getElementById('appContent');

        if (authModal && appContent) {
            authModal.style.display = 'flex';
            appContent.style.display = 'none';
        }
    },

    // Show app content
    showApp() {
        const authModal = document.getElementById('authModal');
        const appContent = document.getElementById('appContent');

        if (authModal && appContent) {
            authModal.style.display = 'none';
            appContent.style.display = 'block';
        }

        // Update user display
        this.updateUserDisplay();
    },

    // Update user display in UI
    updateUserDisplay() {
        const userDisplays = document.querySelectorAll('.firebase-user-display');
        userDisplays.forEach(el => {
            if (this.user) {
                el.textContent = this.user.displayName || this.user.email;
            }
        });
    },

    // Get sync status
    getSyncStatus() {
        return {
            initialized: this.initialized,
            authenticated: this.isAuthenticated(),
            syncEnabled: this.syncEnabled,
            user: this.user ? {
                email: this.user.email,
                displayName: this.user.displayName
            } : null
        };
    },

    // Manually trigger full sync
    async manualSync() {
        if (!this.syncEnabled) {
            return { success: false, message: 'Not authenticated' };
        }

        try {
            await this.pullAllData();
            await this.pushAllData();
            return { success: true, message: 'Sync completed' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    // Migrate data from user workspace to shared workspace
    async migrateToSharedWorkspace() {
        if (!this.syncEnabled || !this.user) {
            return { success: false, message: 'Not authenticated' };
        }

        try {
            console.log('🔄 Starting migration to shared workspace...');
            const migratedKeys = [];
            const failedKeys = [];

            for (const key of this.sharedDataKeys) {
                try {
                    // Load from user workspace
                    const userRef = this.getUserDataRef(key);
                    const snapshot = await userRef.once('value');

                    if (snapshot.exists()) {
                        const data = snapshot.val();

                        // Save to shared workspace
                        const sharedRef = this.getSharedDataRef(key);
                        await sharedRef.set({
                            data: data.data,
                            updatedAt: firebase.database.ServerValue.TIMESTAMP,
                            updatedBy: this.user.email,
                            migratedFrom: `users/${this.user.uid}/userData/${key}`,
                            migratedAt: firebase.database.ServerValue.TIMESTAMP
                        });

                        console.log(`✅ Migrated ${key} to shared workspace`);
                        migratedKeys.push(key);

                        // Optional: Remove from user workspace after successful migration
                        // Uncomment if you want to clean up old data
                        // await userRef.remove();
                    } else {
                        console.log(`ℹ️ No data found for ${key} in user workspace`);
                    }
                } catch (error) {
                    console.error(`❌ Failed to migrate ${key}:`, error);
                    failedKeys.push(key);
                }
            }

            const message = `Migrated ${migratedKeys.length} keys to shared workspace. Failed: ${failedKeys.length}`;
            console.log('✅ Migration complete:', message);

            return {
                success: true,
                message,
                migratedKeys,
                failedKeys
            };
        } catch (error) {
            console.error('Migration error:', error);
            return { success: false, message: error.message };
        }
    }
};

// Note: Firebase sync is now handled directly in storage.js
// storage.js checks for window.FirebaseSync and calls saveData() when available

// Export for use in other modules
window.FirebaseSync = FirebaseSync;
