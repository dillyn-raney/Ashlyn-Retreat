// Firebase Configuration
// Copy this file to firebase-config.js and fill in your actual Firebase credentials

const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Feature flags
window.firebaseFeatures = {
    enabled: true,           // Set to true to enable Firebase sync
    offlineSupport: true,    // Enable offline data support
    autoSync: true,          // Automatically sync data
    syncInterval: 5000       // Sync every 5 seconds
};

// Initialize Firebase
if (window.firebaseFeatures.enabled && typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase config loaded');
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
}
