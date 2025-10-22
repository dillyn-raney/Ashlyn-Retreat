# Complete Deployment Checklist

Use this checklist to deploy The Ashlyn Retreat app with Firebase and secure Gemini AI.

---

## Prerequisites

- [ ] Google account created
- [ ] Node.js 18+ installed
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Git installed (for version control)

---

## Phase 1: Firebase Setup

### 1.1 Create Firebase Project

- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Create new project called "ashlyn-retreat"
- [ ] Disable Google Analytics (not needed)
- [ ] Project created successfully

### 1.2 Enable Firebase Authentication

- [ ] Go to Build → Authentication
- [ ] Click "Get Started"
- [ ] Enable Email/Password authentication
- [ ] Click Save

### 1.3 Create Realtime Database

- [ ] Go to Build → Realtime Database
- [ ] Click "Create Database"
- [ ] Select location (e.g., us-central1)
- [ ] Start in test mode
- [ ] Click Enable

### 1.4 Secure Database

- [ ] Go to Rules tab
- [ ] Paste these rules:
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```
- [ ] Click Publish

### 1.5 Register Web App

- [ ] Click Web icon (</>) on project overview
- [ ] App nickname: "Ashlyn Retreat App"
- [ ] Don't check "Firebase Hosting"
- [ ] Click Register app
- [ ] Copy Firebase config object

### 1.6 Configure App

- [ ] Open `js/firebase-config.js`
- [ ] Paste your Firebase config
- [ ] Set `enabled: true`
- [ ] Save file

---

## Phase 2: Gemini AI Setup

### 2.1 Get Gemini API Key

- [ ] Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ ] Click "Create API key"
- [ ] Select "Create API key in new project"
- [ ] Copy API key (starts with `AIza...`)

### 2.2 Initial Test (Optional - Client-Side)

Skip this if going straight to production with Cloud Functions.

- [ ] Open `js/gemini-config.js`
- [ ] Set `enabled: true`
- [ ] Set `useCloudFunctions: false`
- [ ] Paste API key in `apiKey` field
- [ ] Save and test locally

---

## Phase 3: Cloud Functions Setup (Production)

### 3.1 Login to Firebase

```bash
firebase login
```

- [ ] Browser opens
- [ ] Sign in with Google account
- [ ] Authorization successful

### 3.2 Link Project

```bash
cd "D:\AI Artifacts\Ashlyn Retreat"
firebase use --add
```

- [ ] Select "ashlyn-retreat" project
- [ ] Set alias (e.g., "default")
- [ ] Project linked successfully

### 3.3 Set Environment Variables

```bash
firebase functions:config:set gemini.apikey="YOUR_GEMINI_API_KEY"
```

- [ ] Replace with your actual Gemini API key
- [ ] Command runs successfully
- [ ] Verify with: `firebase functions:config:get`

### 3.4 Deploy Functions

```bash
firebase deploy --only functions
```

- [ ] Functions deploy successfully
- [ ] All 7 functions created:
  - [ ] callGemini
  - [ ] analyzeDailyReflection
  - [ ] analyzeSWOT
  - [ ] analyzeIkigai
  - [ ] analyzeValueProposition
  - [ ] analyzeActionPlan
  - [ ] detectPatterns

### 3.5 Update Client Config

- [ ] Open `js/gemini-config.js`
- [ ] Set `useCloudFunctions: true`
- [ ] Save file

---

## Phase 4: Create User Accounts

### Option A: Via App (Recommended)

- [ ] Open app in browser
- [ ] See login screen
- [ ] Click "Sign up"
- [ ] Create account for Dillyn
- [ ] Sign out
- [ ] Create account for Ashlee

### Option B: Via Firebase Console

- [ ] Go to Authentication in Firebase Console
- [ ] Click "Add user"
- [ ] Add email and password for Dillyn
- [ ] Add email and password for Ashlee

---

## Phase 5: Testing

### 5.1 Basic Functionality

- [ ] App loads without errors
- [ ] Login screen appears
- [ ] Can sign in successfully
- [ ] Can sign out
- [ ] Can switch between users

### 5.2 Data Sync

- [ ] Add journal entry on device 1
- [ ] Open app on device 2 with same account
- [ ] Entry appears on device 2
- [ ] Real-time sync working

### 5.3 Gemini AI

- [ ] Fill out Daily Reflection
- [ ] Click "Get AI Insights"
- [ ] AI insights appear
- [ ] Test SWOT analysis AI
- [ ] Test Ikigai AI
- [ ] Test Pattern Detection

### 5.4 All Features

Go through [TESTING.md](TESTING.md) and check off all items.

---

## Phase 6: Production Deployment (Optional)

### 6.1 Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

- [ ] Hosting deployed
- [ ] Get deployment URL

### 6.2 Update Authorized Domains

- [ ] Go to Authentication → Settings → Authorized domains
- [ ] Add your deployment domain
- [ ] Click Add

### 6.3 Test Production

- [ ] Open deployed URL
- [ ] Test all functionality
- [ ] Verify Cloud Functions work
- [ ] Check Firebase Console for errors

---

## Phase 7: Security Review

### 7.1 Database Rules

- [ ] Rules only allow user access to own data
- [ ] Test: Cannot access other user's data
- [ ] Rules published

### 7.2 API Security

- [ ] Gemini API key NOT in client code
- [ ] `useCloudFunctions: true` in config
- [ ] Only authenticated users can call functions
- [ ] Test: Cannot call functions when logged out

### 7.3 Git Security

- [ ] `.gitignore` includes config files
- [ ] Config files NOT committed to repo
- [ ] Functions node_modules ignored
- [ ] No sensitive data in git history

---

## Phase 8: Monitoring Setup

### 8.1 Firebase Console

- [ ] Bookmark Firebase Console
- [ ] Check Authentication users
- [ ] Check Realtime Database data structure
- [ ] Check Functions invocation count

### 8.2 Usage Monitoring

- [ ] Set calendar reminder to check weekly
- [ ] Check Firebase usage (should be $0)
- [ ] Check Gemini API usage
- [ ] Verify staying within free tier

### 8.3 Budget Alerts (Optional)

- [ ] Go to Google Cloud Console
- [ ] Set budget alert at $5
- [ ] Add notification email

---

## Phase 9: Backups

### 9.1 Code Backup

```bash
git init
git add .
git commit -m "Initial commit - Ashlyn Retreat app"
```

- [ ] Git repo initialized
- [ ] Code committed
- [ ] Push to private GitHub repo (optional)

### 9.2 Data Export

- [ ] Sign in to app
- [ ] Open browser console (F12)
- [ ] Run: `Storage.exportAllData()`
- [ ] Save JSON file as backup
- [ ] Store securely

---

## Phase 10: Documentation

### 10.1 User Documentation

- [ ] Share [README.md](README.md) with Dillyn and Ashlee
- [ ] Share [QUICK_START.md](QUICK_START.md)
- [ ] Explain how to access app
- [ ] Provide login credentials securely

### 10.2 Maintenance Documentation

- [ ] Save [CLOUD_FUNCTIONS_SETUP.md](CLOUD_FUNCTIONS_SETUP.md) for future reference
- [ ] Save [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
- [ ] Save [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) (this file)

---

## Troubleshooting References

If issues occur, consult:

- **Firebase issues**: [FIREBASE_SETUP.md](FIREBASE_SETUP.md) → Troubleshooting section
- **Gemini AI issues**: [GEMINI_SETUP.md](GEMINI_SETUP.md) → Troubleshooting section
- **Cloud Functions issues**: [CLOUD_FUNCTIONS_SETUP.md](CLOUD_FUNCTIONS_SETUP.md) → Troubleshooting section
- **General testing**: [TESTING.md](TESTING.md)

---

## Quick Commands Reference

### Firebase

```bash
# Login
firebase login

# Link project
firebase use --add

# Set API key
firebase functions:config:set gemini.apikey="YOUR_KEY"

# Deploy functions
firebase deploy --only functions

# Deploy hosting
firebase deploy --only hosting

# View logs
firebase functions:log

# Check config
firebase functions:config:get
```

### Testing

```bash
# Start local server
python -m http.server 8000
# Open: http://localhost:8000

# Start Firebase emulators (optional)
firebase emulators:start
```

---

## Success Criteria

Your deployment is complete when:

- ✅ App loads on multiple devices
- ✅ Both users can sign in
- ✅ Data syncs across devices in real-time
- ✅ AI insights work on all tools
- ✅ No errors in browser console
- ✅ No errors in Firebase Functions logs
- ✅ Firebase usage shows $0 cost
- ✅ All items in this checklist are checked off

---

## Post-Deployment

### First Week

- [ ] Monitor Firebase Console daily
- [ ] Check for errors in function logs
- [ ] Verify both users can access
- [ ] Get feedback from Dillyn and Ashlee

### Ongoing

- [ ] Check Firebase usage monthly
- [ ] Export data monthly as backup
- [ ] Review Gemini API usage
- [ ] Update dependencies quarterly

---

## Support Resources

- **Firebase Console**: https://console.firebase.google.com/
- **Firebase Docs**: https://firebase.google.com/docs
- **Gemini API Docs**: https://ai.google.dev/docs
- **Google AI Studio**: https://makersuite.google.com/
- **Project Files**: All markdown files in this directory

---

## Summary

**Time to Complete**: 30-45 minutes
**Total Cost**: $0/month (within free tiers)
**Complexity**: Medium
**Maintenance**: Minimal (check monthly)

**Result**: Fully functional, secure, cloud-synced retreat planning app with AI-powered insights! 🎉

---

**Date Deployed**: _______________
**Deployed By**: _______________
**Production URL**: _______________
**Notes**: _______________
