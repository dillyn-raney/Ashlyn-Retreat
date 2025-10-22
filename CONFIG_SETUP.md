# Configuration Setup Guide

## Overview

The app uses two configuration files that are **NOT tracked in git** for security:
- `js/firebase-config.js` - Firebase credentials
- `js/gemini-config.js` - Gemini AI API key

These files are in `.gitignore` and won't be deployed to GitHub Pages.

## How It Works

### Config Loader System

The app uses `js/config-loader.js` which:
1. Sets default configs (disabled state)
2. Attempts to load `firebase-config.js` if it exists
3. Attempts to load `gemini-config.js` if it exists
4. Handles missing files gracefully

### Three Deployment Scenarios

#### 1. Local Development (Full Features)
```
✅ firebase-config.js exists (your credentials)
✅ gemini-config.js exists (your API key)
✅ All features enabled
```

#### 2. GitHub Pages (Basic Features)
```
❌ firebase-config.js missing (gitignored)
❌ gemini-config.js missing (gitignored)
✅ App works in offline mode
✅ All features work except sync and AI
```

#### 3. Custom Deployment (Your Choice)
```
You can create config files on your server
Configure which features to enable
Mix and match as needed
```

## Setting Up Configs

### For Local Development

1. **Copy the example files:**
   ```bash
   cp js/firebase-config.example.js js/firebase-config.js
   cp js/gemini-config.example.js js/gemini-config.js
   ```

2. **Edit `js/firebase-config.js`:**
   - Add your Firebase credentials
   - Set `enabled: true`

3. **Edit `js/gemini-config.js`:**
   - Add your Gemini API key (if not using Cloud Functions)
   - Set `enabled: true`
   - Set `useCloudFunctions: true` for production

### For GitHub Pages Deployment

**Nothing to do!** The app works without config files:
- Runs in offline mode
- LocalStorage for data persistence
- All features work except:
  - Cloud sync
  - AI insights

### For Custom Server Deployment

1. Upload config files to your server
2. Place them in the `js/` directory
3. Ensure proper permissions (readable by web server)
4. The app will detect and use them automatically

## Console Messages

### Without Config Files
```
ℹ️ Firebase config not found - using defaults (offline mode)
ℹ️ Gemini config not found - AI features disabled
Firebase disabled, running in offline mode
```

### With Config Files
```
✅ Firebase config loaded
✅ Gemini config loaded
Firebase initialized successfully
```

## Security Notes

### What's Protected
- Firebase API keys (domain-restricted, but still private)
- Gemini API keys (billable, keep private)
- Database URLs
- Project IDs

### What's Safe to Commit
- All `.example.js` files (have placeholder values)
- `config-loader.js` (default configs only)
- All other app code

### Best Practices
1. ✅ Keep config files in `.gitignore`
2. ✅ Use Cloud Functions for Gemini in production
3. ✅ Restrict Firebase API keys to your domain
4. ✅ Use Firebase security rules
5. ❌ Never commit real API keys to git
6. ❌ Never share config files publicly

## Troubleshooting

### App Not Loading
- Check browser console for errors
- Verify `config-loader.js` is loading
- Hard refresh (Ctrl+F5)

### Features Not Working
**Firebase/Sync Issues:**
- Verify `firebase-config.js` exists (local only)
- Check `enabled: true` in config
- Verify Firebase console settings

**AI Features Not Working:**
- Verify `gemini-config.js` exists (local only)
- Check `enabled: true` in config
- Verify API key is correct
- Check Cloud Functions are deployed

### 404 Errors for Config Files
**This is normal on GitHub Pages!**
- Config files are gitignored
- Config loader handles this gracefully
- App runs in offline mode
- See console for informative messages

## File Structure

```
js/
├── config-loader.js           ✅ Committed (safe defaults)
├── firebase-config.example.js ✅ Committed (template)
├── firebase-config.js         ❌ Gitignored (your credentials)
├── gemini-config.example.js   ✅ Committed (template)
├── gemini-config.js           ❌ Gitignored (your API key)
├── firebase.js                ✅ Committed (app logic)
├── gemini.js                  ✅ Committed (app logic)
└── ...
```

## Quick Reference

### Start From Scratch
```bash
# Clone repo
git clone https://github.com/dillyn-raney/Ashlyn-Retreat.git
cd Ashlyn-Retreat

# Copy example configs
cp js/firebase-config.example.js js/firebase-config.js
cp js/gemini-config.example.js js/gemini-config.js

# Edit configs with your credentials
# Then open index.html or deploy
```

### Check Current Config Status
Open browser console and look for:
- ✅ "Firebase config loaded" = Config file found
- ℹ️ "Firebase config not found" = Using defaults (offline mode)
- Same for Gemini config

### Force Offline Mode
Even if you have config files, you can disable features:
```javascript
// In firebase-config.js
window.firebaseFeatures.enabled = false;

// In gemini-config.js
window.geminiConfig.enabled = false;
```

## Related Documentation

- `FIREBASE_SETUP.md` - How to set up Firebase
- `GEMINI_SETUP.md` - How to set up Gemini AI
- `SHARED_WORKSPACE_SUMMARY.md` - Firebase shared workspace
- `FIREBASE_SECURITY_RULES.md` - Firebase security configuration

---

**Remember:** The app is designed to work perfectly with OR without these config files. Choose the setup that works best for you!
