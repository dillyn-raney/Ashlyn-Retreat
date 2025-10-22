// Firebase Configuration
// API keys are domain-restricted and safe to commit
// These are PUBLIC keys - they identify your Firebase project

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
    enabled: true, // Enable Firebase features
    offlineSupport: true,
    autoSync: true,
    syncInterval: 5000 // Sync every 5 seconds when online
};
