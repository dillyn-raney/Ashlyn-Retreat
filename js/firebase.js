// Firebase Integration for Ashlyn Retreat App
// Provides authentication and real-time database sync

const FirebaseSync = {
    initialized: false,
    user: null,
    db: null,
    auth: null,
    syncEnabled: false,
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

    // Get user data reference
    getUserDataRef(path = '') {
        if (!this.user) return null;
        const basePath = `users/${this.user.uid}/userData`;
        return path ? this.db.ref(`${basePath}/${path}`) : this.db.ref(basePath);
    },

    // Save data to Firebase
    async saveData(key, data) {
        if (!this.syncEnabled || !this.user) {
            return false;
        }

        try {
            const ref = this.getUserDataRef(key);
            await ref.set({
                data: data,
                updatedAt: firebase.database.ServerValue.TIMESTAMP
            });
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
            const ref = this.getUserDataRef(key);
            const snapshot = await ref.once('value');

            if (snapshot.exists()) {
                const result = snapshot.val();
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

        const ref = this.getUserDataRef(key);

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
        const ref = this.getUserDataRef(key);
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
                if (firebaseData !== null) {
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
            if (firebaseData !== null) {
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
    }
};

// Note: Firebase sync is now handled directly in storage.js
// storage.js checks for window.FirebaseSync and calls saveData() when available

// Export for use in other modules
window.FirebaseSync = FirebaseSync;
