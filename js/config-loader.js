// Configuration Loader
// Loads Firebase and Gemini configs if available, or uses defaults

(function() {
    'use strict';

    // Default Firebase config (disabled state)
    window.firebaseConfig = {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        measurementId: ""
    };

    window.firebaseFeatures = {
        enabled: false,
        offlineSupport: true,
        autoSync: false,
        syncInterval: 5000
    };

    // Default Gemini config (disabled state)
    window.geminiConfig = {
        enabled: false,
        useCloudFunctions: false,
        apiKey: "",
        model: "gemini-2.5-flash-lite",
        apiEndpoint: "https://generativelanguage.googleapis.com/v1beta/models",
        features: {
            journalInsights: false,
            businessAnalysis: false,
            actionSuggestions: false,
            patternDetection: false,
            encouragement: false
        },
        rateLimiting: {
            maxRequestsPerHour: 20,
            maxRequestsPerDay: 100
        },
        prompts: {
            dailyReflection: "",
            swotAnalysis: "",
            ikigaiAnalysis: "",
            valuePropositionAnalysis: "",
            actionPlanAnalysis: "",
            patternDetection: ""
        }
    };

    // Try to load Firebase config
    const firebaseScript = document.createElement('script');
    firebaseScript.src = 'js/firebase-config.js';
    firebaseScript.onerror = function() {
        console.info('ℹ️ Firebase config not found - using defaults (offline mode)');
    };
    firebaseScript.onload = function() {
        console.log('✅ Firebase config loaded');
    };

    // Try to load Gemini config
    const geminiScript = document.createElement('script');
    geminiScript.src = 'js/gemini-config.js';
    geminiScript.onerror = function() {
        console.info('ℹ️ Gemini config not found - AI features disabled');
    };
    geminiScript.onload = function() {
        console.log('✅ Gemini config loaded');
    };

    // Add scripts to document
    document.head.appendChild(firebaseScript);
    document.head.appendChild(geminiScript);

})();
