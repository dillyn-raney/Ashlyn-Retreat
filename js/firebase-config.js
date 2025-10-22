// Firebase Configuration
// You need to replace these values with your own Firebase project credentials
// See FIREBASE_SETUP.md for instructions

const firebaseConfig = {
  apiKey: "AIzaSyCnU4l-deBuhH7ncoM1A0E5A2VDBW78jbU",
  authDomain: "ashlyn-retreat.firebaseapp.com",
  databaseURL: "https://ashlyn-retreat-default-rtdb.firebaseio.com",
  projectId: "ashlyn-retreat",
  storageBucket: "ashlyn-retreat.firebasestorage.app",
  messagingSenderId: "537703046343",
  appId: "1:537703046343:web:95349859e334cfb659f2e2",
  measurementId: "G-N2FJFWDS9K"
};

// Export config
window.firebaseConfig = firebaseConfig;

// Feature flags
window.firebaseFeatures = {
    enabled: true, // Set to true after configuring Firebase
    offlineSupport: true,
    autoSync: true,
    syncInterval: 5000 // Sync every 5 seconds when online
};
