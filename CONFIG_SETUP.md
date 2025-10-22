# Configuration Setup Guide

## Overview

The app's configuration files are now **SAFE TO COMMIT** to git:
- `js/firebase-config.js` - Contains public Firebase config (domain-restricted)
- `js/gemini-config.js` - Uses Cloud Functions (no API key in client)

**All sensitive API keys are stored securely in Firebase Cloud Functions.**

## How It Works

### Firebase Configuration
Firebase API keys are **public identifiers** that are domain-restricted:
- Safe to commit to public repositories
- Only work from authorized domains (dillyn-raney.github.io)
- Firebase security rules control actual data access

### Gemini AI Configuration
Gemini API key is **stored in Firebase Functions**:
- Client code has `apiKey: ""` (empty)
- `useCloudFunctions: true` routes requests through Firebase
- API key is never exposed to browser
- Stored securely with: `firebase functions:config:set gemini.apikey="YOUR_KEY"`

## Deployment

### GitHub Pages (Production)
```
✅ firebase-config.js committed (safe public config)
✅ gemini-config.js committed (uses Cloud Functions)
✅ All features work
✅ API keys secured in Firebase backend
```

### Local Development
```
✅ Same files as production
✅ All features work
✅ API keys secured in Firebase backend
```

## Security Model

### What's Public (Safe to Commit)
- Firebase API keys - Domain-restricted
- Firebase project IDs
- Firebase auth domain
- Gemini config with `useCloudFunctions: true`

### What's Private (Secured in Firebase)
- Gemini API key - In Cloud Functions environment
- Firebase security rules - Control data access
- User authentication - Handled by Firebase

### Protection Layers
1. **Firebase API Keys**: Domain-restricted to dillyn-raney.github.io
2. **Firebase Security Rules**: Control who can read/write data
3. **Cloud Functions**: Proxy Gemini requests, keep API key secret
4. **Authentication**: Required for accessing user data

## Initial Setup (One-Time)

### 1. Firebase Project
Already configured with:
- Project: ashlyn-retreat
- Authentication enabled
- Realtime Database created
- Security rules deployed

### 2. Cloud Functions
Already deployed with Gemini API key:
```bash
cd functions
firebase functions:config:set gemini.apikey="YOUR_ACTUAL_KEY"
firebase deploy --only functions
```

### 3. Config Files
Already committed with safe values:
- `js/firebase-config.js` - Public Firebase config
- `js/gemini-config.js` - Cloud Functions enabled

## No Setup Required!

The app is **ready to use** on GitHub Pages:
- ✅ Firebase sync works
- ✅ AI features work
- ✅ All data is secure
- ✅ No local config needed

## Making Changes

### Update Firebase Config
Edit `js/firebase-config.js`:
```javascript
window.firebaseFeatures = {
    enabled: true,  // Toggle Firebase on/off
    offlineSupport: true,
    autoSync: true,
    syncInterval: 5000
};
```

### Update Gemini Config
Edit `js/gemini-config.js`:
```javascript
const geminiConfig = {
    enabled: true,  // Toggle AI features
    useCloudFunctions: true,  // Always true for production
    apiKey: "",  // Always empty (key in Cloud Functions)
    // ...
};
```

### Update Gemini API Key (Cloud Functions)
```bash
cd functions
firebase functions:config:set gemini.apikey="NEW_KEY"
firebase deploy --only functions
```

## Troubleshooting

### Firebase Not Working
**Check:**
1. Firebase config enabled: `window.firebaseFeatures.enabled = true`
2. Security rules deployed to Firebase console
3. User is authenticated (signed in)

**Console shows:**
```
✅ Firebase initialized successfully
✅ User logged in: user@example.com
```

### AI Features Not Working
**Check:**
1. Gemini config enabled: `geminiConfig.enabled = true`
2. Cloud Functions enabled: `useCloudFunctions: true`
3. Cloud Functions deployed: `firebase deploy --only functions`
4. API key set: `firebase functions:config:get`

**Console shows:**
```
✅ Gemini Cloud Functions initialized
✅ Generated insight successfully
```

### "API key not configured"
This means Cloud Functions aren't set up:
```bash
cd functions
firebase functions:config:set gemini.apikey="YOUR_KEY"
firebase deploy --only functions
```

## File Structure

```
js/
├── firebase-config.js         ✅ Committed (safe public values)
├── gemini-config.js           ✅ Committed (uses Cloud Functions)
├── firebase.js                ✅ Committed (app logic)
├── gemini-cloud.js            ✅ Committed (Cloud Functions integration)
├── gemini.js                  ✅ Committed (AI logic)
└── ...

functions/
├── index.js                   ✅ Committed (Cloud Functions code)
├── .runtimeconfig.json        ❌ Gitignored (local only)
└── ...
```

## Migration from Old Setup

If you had the old setup with gitignored configs:

### Remove from .gitignore
These are now safe to commit:
- `js/firebase-config.js`
- `js/gemini-config.js`

### Update Configs
1. Replace `firebase-config.js` with the version in this repo
2. Replace `gemini-config.js` with the version in this repo
3. Commit both files

### Move API Key
If you had Gemini API key in client config:
```bash
cd functions
firebase functions:config:set gemini.apikey="YOUR_KEY_FROM_OLD_CONFIG"
firebase deploy --only functions
```

## Benefits

### Security
- API keys never exposed in browser
- Firebase keys are domain-restricted
- Cloud Functions proxy sensitive requests

### Deployment
- Simple git push to deploy
- No environment variables to manage
- Works on any hosting platform

### Collaboration
- Team members get same config
- No local setup required
- Consistent across all environments

## Related Documentation

- `FIREBASE_SETUP.md` - Firebase project setup
- `GEMINI_SETUP.md` - Gemini AI setup
- `CLOUD_FUNCTIONS_SETUP.md` - Cloud Functions deployment
- `FIREBASE_SECURITY_RULES.md` - Database security

---

**The app is production-ready with all API keys secured!**
