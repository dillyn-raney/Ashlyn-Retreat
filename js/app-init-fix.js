// ADD THIS CODE TO THE BEGINNING OF app.js, REPLACING THE EXISTING DOMContentLoaded

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // FIREBASE INITIALIZATION FIRST
        if (window.firebaseFeatures && window.firebaseFeatures.enabled) {
            console.log('Firebase enabled, initializing...');
            const firebaseInitialized = await FirebaseSync.init();

            if (firebaseInitialized) {
                console.log('Firebase initialized successfully');
                // Setup Firebase UI handlers
                setupFirebaseUI();

                // Wait for authentication before showing app
                // The onAuthStateChanged handler in firebase.js will call initializeApp()
                return; // Don't initialize app yet, wait for auth
            } else {
                console.log('Firebase failed to initialize, continuing in offline mode');
                // Fall through to initialize app normally
            }
        } else {
            console.log('Firebase disabled, running in offline mode');
        }

        // Initialize app (if Firebase disabled or failed)
        await initializeApp();

    } catch (error) {
        console.error('Error initializing:', error);
        alert('Error loading application. Please refresh the page.');
    }
});

// Separate function for app initialization
async function initializeApp() {
    try {
        // Load retreat data
        await loadRetreatData();

        // Initialize user
        currentUser = Storage.getCurrentUser();
        updateUserDisplay();

        // Setup event listeners
        setupEventListeners();

        // Render all sections
        renderSchedule();
        renderMeals();
        renderSupplies();
        renderPrompts();
        loadJournalData();
        loadToolsData();

        // Setup countdown timer
        updateCountdownTimer();
        setInterval(updateCountdownTimer, 60000);

        // Update progress
        updateSuppliesProgress();

        // Setup smooth scrolling
        setupSmoothScrolling();

        console.log('App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('Error loading retreat data. Please refresh the page.');
    }
}

// Make initializeApp global so Firebase handlers can call it
window.initializeApp = initializeApp;
