// LocalStorage Management for Ashlyn Retreat App

const Storage = {
    // Storage keys
    keys: {
        supplies: 'ashlyn_retreat_supplies',
        dillyn_journals: 'ashlyn_retreat_dillyn_journals',
        ashlee_journals: 'ashlyn_retreat_ashlee_journals',
        swot_analyses: 'ashlyn_retreat_swot',
        ikigai: 'ashlyn_retreat_ikigai',
        value_prop: 'ashlyn_retreat_value_prop',
        kanban: 'ashlyn_retreat_kanban',
        action_plan: 'ashlyn_retreat_action_plan',
        user_preferences: 'ashlyn_retreat_preferences'
    },

    // Save data to localStorage (and Firebase if enabled)
    save(key, data, skipFirebaseSync = false) {
        console.log('💾 Storage.save called for:', key, skipFirebaseSync ? '(skipping Firebase sync)' : '');
        console.log('   FirebaseSync exists?', !!window.FirebaseSync);
        console.log('   FirebaseSync.syncEnabled?', window.FirebaseSync?.syncEnabled);

        try {
            localStorage.setItem(key, JSON.stringify(data));

            // Sync to Firebase if available and enabled (and not coming from Firebase)
            if (!skipFirebaseSync && window.FirebaseSync && window.FirebaseSync.syncEnabled) {
                console.log('🔄 Storage.save: Syncing to Firebase:', key);
                window.FirebaseSync.saveData(key, data).then(() => {
                    console.log('✅ Firebase sync successful:', key);
                }).catch(err => {
                    console.error('❌ Firebase sync failed:', key, err);
                });
            } else if (skipFirebaseSync) {
                console.log('⏭️ Skipping Firebase sync for:', key);
            } else {
                console.log('⚠️ Firebase not available or disabled for:', key);
                console.log('   window.FirebaseSync:', window.FirebaseSync);
                console.log('   syncEnabled:', window.FirebaseSync?.syncEnabled);
            }

            return true;
        } catch (e) {
            console.error('Storage failed:', e);
            if (e.name === 'QuotaExceededError') {
                alert('Storage quota exceeded. Please export your data and clear some space.');
            }
            return false;
        }
    },

    // Load data from localStorage
    load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('Load failed:', e);
            return defaultValue;
        }
    },

    // Remove item from localStorage
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Remove failed:', e);
            return false;
        }
    },

    // Clear all app data
    clearAll() {
        const confirmed = confirm('Are you sure you want to clear all data? This cannot be undone.');
        if (confirmed) {
            Object.values(this.keys).forEach(key => {
                this.remove(key);
            });
            alert('All data has been cleared.');
            return true;
        }
        return false;
    },

    // Export all data as JSON
    exportAllData() {
        const allData = {};
        Object.entries(this.keys).forEach(([name, key]) => {
            allData[name] = this.load(key);
        });

        const dataStr = JSON.stringify(allData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `ashlyn-retreat-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    // Import data from JSON file
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    Object.entries(data).forEach(([name, value]) => {
                        if (this.keys[name] && value !== null) {
                            this.save(this.keys[name], value);
                        }
                    });
                    alert('Data imported successfully!');
                    resolve(true);
                } catch (err) {
                    alert('Error importing data. Please check the file format.');
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    },

    // Get current user
    getCurrentUser() {
        const prefs = this.load(this.keys.user_preferences, { currentUser: 'Dillyn' });
        return prefs.currentUser || 'Dillyn';
    },

    // Set current user
    setCurrentUser(user) {
        const prefs = this.load(this.keys.user_preferences, {});
        prefs.currentUser = user;
        this.save(this.keys.user_preferences, prefs);
    },

    // Get journals for current user
    getUserJournals(user = null) {
        user = user || this.getCurrentUser();
        const key = user === 'Dillyn' ? this.keys.dillyn_journals : this.keys.ashlee_journals;
        return this.load(key, {
            daily: {},
            freeform: [],
            futureLetter: {}
        });
    },

    // Save journals for current user
    saveUserJournals(data, user = null) {
        user = user || this.getCurrentUser();
        const key = user === 'Dillyn' ? this.keys.dillyn_journals : this.keys.ashlee_journals;
        return this.save(key, data);
    },

    // Save daily reflection
    saveDailyReflection(date, data, user = null) {
        const journals = this.getUserJournals(user);
        journals.daily[date] = {
            ...data,
            timestamp: new Date().toISOString()
        };
        return this.saveUserJournals(journals, user);
    },

    // Get daily reflection
    getDailyReflection(date, user = null) {
        const journals = this.getUserJournals(user);
        return journals.daily[date] || null;
    },

    // Save freeform entry
    saveFreeformEntry(entry, user = null) {
        const journals = this.getUserJournals(user);
        entry.timestamp = entry.timestamp || new Date().toISOString();
        entry.id = entry.id || Date.now();

        // Check if updating existing entry
        const existingIndex = journals.freeform.findIndex(e => e.id === entry.id);
        if (existingIndex !== -1) {
            journals.freeform[existingIndex] = entry;
        } else {
            journals.freeform.push(entry);
        }

        // Sort by date, newest first
        journals.freeform.sort((a, b) => new Date(b.date) - new Date(a.date));

        return this.saveUserJournals(journals, user);
    },

    // Get all freeform entries
    getFreeformEntries(user = null) {
        const journals = this.getUserJournals(user);
        return journals.freeform || [];
    },

    // Save future letter
    saveFutureLetter(data, user = null) {
        const journals = this.getUserJournals(user);
        journals.futureLetter = {
            ...data,
            timestamp: new Date().toISOString()
        };
        return this.saveUserJournals(journals, user);
    },

    // Get future letter
    getFutureLetter(user = null) {
        const journals = this.getUserJournals(user);
        return journals.futureLetter || {};
    },

    // Delete daily entry
    deleteDailyEntry(date, user = null) {
        const journals = this.getUserJournals(user);
        if (journals.daily && journals.daily[date]) {
            delete journals.daily[date];
            return this.saveUserJournals(journals, user);
        }
        return false;
    },

    // Delete freeform entry
    deleteFreeformEntry(index, user = null) {
        const journals = this.getUserJournals(user);
        if (journals.freeform && journals.freeform[index] !== undefined) {
            journals.freeform.splice(index, 1);
            return this.saveUserJournals(journals, user);
        }
        return false;
    },

    // Tool data management
    saveToolData(toolName, data) {
        const key = this.keys[toolName];
        if (!key) return false;
        return this.save(key, {
            ...data,
            lastModified: new Date().toISOString()
        });
    },

    getToolData(toolName, defaultValue = {}) {
        const key = this.keys[toolName];
        if (!key) return defaultValue;
        return this.load(key, defaultValue);
    },

    // Supplies management
    getSupplies() {
        return this.load(this.keys.supplies, { checked: {}, custom: [] });
    },

    saveSupplies(suppliesData) {
        return this.save(this.keys.supplies, suppliesData);
    },

    toggleSupply(category, itemIndex) {
        const supplies = this.getSupplies();
        if (!supplies.checked) supplies.checked = {};
        const key = `${category}_${itemIndex}`;
        supplies.checked[key] = !supplies.checked[key];
        this.saveSupplies(supplies);
        return supplies.checked[key];
    },

    resetSupplies() {
        const supplies = this.getSupplies();
        supplies.checked = {};
        return this.save(this.keys.supplies, supplies);
    },

    getSuppliesProgress() {
        const supplies = this.getSupplies();
        const checkedCount = Object.values(supplies.checked || {}).filter(v => v).length;
        const totalCount = Object.keys(supplies.checked || {}).length;
        return totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;
    },

    // Custom supplies management
    getCustomSupplies() {
        const supplies = this.getSupplies();
        return supplies.custom || [];
    },

    addCustomSupply(category, item) {
        const supplies = this.getSupplies();
        if (!supplies.custom) supplies.custom = [];
        supplies.custom.push({
            id: Date.now(),
            category: category,
            item: item,
            createdAt: new Date().toISOString()
        });
        this.saveSupplies(supplies);
        return true;
    },

    editCustomSupply(id, category, item) {
        const supplies = this.getSupplies();
        if (!supplies.custom) return false;
        const index = supplies.custom.findIndex(s => s.id === id);
        if (index === -1) return false;
        supplies.custom[index].category = category;
        supplies.custom[index].item = item;
        supplies.custom[index].updatedAt = new Date().toISOString();
        this.saveSupplies(supplies);
        return true;
    },

    deleteCustomSupply(id) {
        const supplies = this.getSupplies();
        if (!supplies.custom) return false;
        supplies.custom = supplies.custom.filter(s => s.id !== id);
        this.saveSupplies(supplies);
        return true;
    },

    // Kanban management
    getKanban() {
        return this.load(this.keys.kanban, {
            develop: [],
            ready: [],
            parking: []
        });
    },

    saveKanban(kanbanData) {
        return this.save(this.keys.kanban, kanbanData);
    },

    addKanbanCard(card) {
        const kanban = this.getKanban();
        card.id = card.id || Date.now();
        card.createdAt = card.createdAt || new Date().toISOString();

        const column = card.column || 'develop';
        kanban[column].push(card);

        return this.saveKanban(kanban);
    },

    moveKanbanCard(cardId, fromColumn, toColumn) {
        const kanban = this.getKanban();

        // Ensure columns exist
        if (!kanban.develop) kanban.develop = [];
        if (!kanban.ready) kanban.ready = [];
        if (!kanban.parking) kanban.parking = [];

        // Check if moving to "ready" and already has a card
        if (toColumn === 'ready' && kanban.ready.length > 0) {
            alert('Only ONE card can be in "Ready for Action" at a time. Please move the existing card first.');
            return false;
        }

        // Find and remove card from source column
        if (!Array.isArray(kanban[fromColumn])) {
            console.error(`Invalid fromColumn: ${fromColumn}`);
            return false;
        }

        const cardIndex = kanban[fromColumn].findIndex(c => c.id === cardId);
        if (cardIndex === -1) {
            console.error(`Card ${cardId} not found in ${fromColumn}`);
            return false;
        }

        const [card] = kanban[fromColumn].splice(cardIndex, 1);

        // Add to destination column
        if (!Array.isArray(kanban[toColumn])) {
            console.error(`Invalid toColumn: ${toColumn}`);
            return false;
        }

        kanban[toColumn].push(card);

        return this.saveKanban(kanban);
    },

    deleteKanbanCard(cardId, column) {
        const kanban = this.getKanban();
        kanban[column] = kanban[column].filter(c => c.id !== cardId);
        return this.saveKanban(kanban);
    }
};

// Auto-save utility with debouncing
class AutoSaver {
    constructor(saveFunction, delay = 30000) {
        this.saveFunction = saveFunction;
        this.delay = delay;
        this.timeout = null;
        this.saveOnBlur = true;
    }

    // Trigger save with debounce
    trigger() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.saveFunction();
        }, this.delay);
    }

    // Immediate save
    saveNow() {
        clearTimeout(this.timeout);
        this.saveFunction();
    }

    // Cancel pending save
    cancel() {
        clearTimeout(this.timeout);
    }
}

// Export for use in other modules
window.Storage = Storage;
window.AutoSaver = AutoSaver;
