# Firebase Setup Guide

This guide will help you set up Firebase to enable cross-device data synchronization for The Ashlyn Retreat app.

**Time Required**: 10-15 minutes
**Cost**: FREE (Firebase free tier is more than enough for this app)

---

## Why Firebase?

With Firebase enabled, you can:
- ✅ Access your data from any device (phone, tablet, laptop)
- ✅ Real-time sync - changes appear instantly on all devices
- ✅ Automatic backup in the cloud
- ✅ Share data between Dillyn and Ashlee (each has their own login)
- ✅ Offline support - works without internet, syncs when back online

---

## Step 1: Create Firebase Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Get Started" or "Add Project"
3. Sign in with your Google account (or create one)

---

## Step 2: Create Firebase Project

1. Click **"Create a project"**
2. Enter project name: `ashlyn-retreat` (or any name you prefer)
3. Click **Continue**
4. **Disable Google Analytics** (not needed for this app)
5. Click **Create project**
6. Wait for project to be created (~30 seconds)
7. Click **Continue**

---

## Step 3: Register Web App

1. In your Firebase project dashboard, click the **Web icon** (</> symbol)
2. App nickname: `Ashlyn Retreat App`
3. **Do NOT check** "Also set up Firebase Hosting"
4. Click **Register app**
5. You'll see a configuration object - **KEEP THIS PAGE OPEN** (you'll need it in Step 6)

---

## Step 4: Enable Authentication

1. In the left sidebar, click **Build** → **Authentication**
2. Click **Get Started**
3. Click on **Email/Password** in the sign-in providers list
4. **Enable** the toggle switch
5. Click **Save**

---

## Step 5: Enable Realtime Database

1. In the left sidebar, click **Build** → **Realtime Database**
2. Click **Create Database**
3. Select location: Choose closest to you (e.g., **us-central1**)
4. Click **Next**
5. Start in **test mode** (we'll secure it next)
6. Click **Enable**

### Secure Your Database

After database is created:

1. Click the **Rules** tab
2. Replace the existing rules with this:

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

3. Click **Publish**

This ensures each user can only access their own data.

---

## Step 6: Configure Your App

Now you need to add your Firebase credentials to the app.

### Get Your Configuration

1. Go back to Firebase Console
2. Click the **gear icon** (⚙️) → **Project settings**
3. Scroll down to **"Your apps"**
4. You'll see your Firebase configuration like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Update firebase-config.js

1. Open `js/firebase-config.js` in your app folder
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",              // Replace with actual value
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

3. **IMPORTANT**: Change `enabled: false` to `enabled: true`:

```javascript
window.firebaseFeatures = {
    enabled: true,  // ← Change this from false to true
    offlineSupport: true,
    autoSync: true,
    syncInterval: 5000
};
```

4. Save the file

---

## Step 7: Create User Accounts

Now that Firebase is configured, you need to create accounts for Dillyn and Ashlee.

### Option A: Create via App (Recommended)

1. Open your app (`index.html`)
2. You'll see the Firebase sign-in screen
3. Click **"Sign up"**
4. Enter:
   - Name: Dillyn
   - Email: dillyn@example.com (or real email)
   - Password: (at least 6 characters)
5. Click **Create Account**
6. Repeat for Ashlee with different email

### Option B: Create via Firebase Console

1. Go to **Authentication** in Firebase Console
2. Click **Add user**
3. Enter email and password
4. Click **Add user**
5. Repeat for second user

---

## Step 8: Test the Setup

1. Open your app
2. Sign in with one account
3. Add some journal entries or check off supplies
4. Sign out
5. Sign in with the other account
6. Verify data is separate
7. Open app on another device
8. Sign in with same account
9. Verify data syncs!

---

## Step 9: Deploy to Web (Optional)

If you deployed to GitHub Pages or another host:

1. Make sure you updated `firebase-config.js`
2. Commit and push changes:
```bash
git add js/firebase-config.js
git commit -m "Configure Firebase"
git push
```

3. Wait for deployment (~1 minute for GitHub Pages)
4. Test at your deployed URL

---

## Troubleshooting

### "Firebase not defined" error
- **Problem**: Firebase SDK not loading
- **Solution**: Check internet connection, Firebase CDN should load automatically

### "Auth domain not authorized"
- **Problem**: Your deployed domain not authorized
- **Solution**:
  1. Go to **Authentication** → **Settings** → **Authorized domains**
  2. Add your GitHub Pages domain: `username.github.io`
  3. Click **Add**

### "Permission denied" errors
- **Problem**: Database rules not set correctly
- **Solution**: Review Step 5 and ensure rules are published

### Data not syncing
- **Problem**: `enabled` still set to `false`
- **Solution**: Check `firebase-config.js` and ensure `enabled: true`

### Can't sign in
- **Problem**: Email/password authentication not enabled
- **Solution**: Review Step 4

---

## How It Works

### When Firebase is Enabled:

1. **First Load**: App shows login screen
2. **Sign In/Up**: User creates account or signs in
3. **Auto-Sync**: Every time data changes, it's saved to both:
   - LocalStorage (local backup)
   - Firebase (cloud sync)
4. **Real-time Updates**: If you change data on one device, it appears on others instantly
5. **Offline Support**: Works without internet, syncs when back online

### When Firebase is Disabled:

- App works exactly as before
- Data stored in localStorage only
- No login required
- No cross-device sync

---

## Security Notes

✅ **Secure**:
- Each user can only access their own data
- Passwords are hashed by Firebase
- HTTPS encryption for all data transfer
- Database rules prevent unauthorized access

❌ **Do NOT**:
- Share your Firebase credentials publicly
- Commit `firebase-config.js` with real credentials to public repos
- Use weak passwords

---

## Firebase Free Tier Limits

The free tier is MORE than enough for this app:

- **Authentication**: 10,000 users/month (you need 2)
- **Database**: 1 GB storage (you'll use < 1 MB)
- **Database**: 10 GB download/month (plenty)
- **Database**: 100 concurrent connections (you need 2-4)

You will NOT hit any limits with this app! 🎉

---

## Cost

**$0/month** - Completely free for this use case!

Firebase only charges if you exceed free tier limits, which won't happen with 2 users.

---

## Managing Users

### View Users

1. Firebase Console → **Authentication**
2. See list of users with emails

### Reset Password

**Via Firebase Console**:
1. Authentication → Users
2. Click 3 dots next to user → **Reset password**
3. User receives email with reset link

**Via App**:
- Currently not implemented
- Users must use Firebase Console

### Delete User

1. Authentication → Users
2. Click 3 dots → **Delete user**
3. Confirm deletion

---

## Backup & Export Data

### Export User Data

Even with Firebase, you can still export data:

1. Sign in to app
2. Open browser console (F12)
3. Type: `Storage.exportAllData()`
4. JSON file downloads

### Import Data

Not currently implemented, but data is always synced to Firebase anyway.

---

## Advanced Options

### Change Sync Interval

In `firebase-config.js`:

```javascript
syncInterval: 5000  // Sync every 5 seconds (default)
// Change to:
syncInterval: 10000  // Sync every 10 seconds (less frequent)
syncInterval: 1000   // Sync every 1 second (more frequent)
```

### Disable Offline Support

```javascript
offlineSupport: false  // Data must be online to sync
```

### Disable Auto-Sync

```javascript
autoSync: false  // Manual sync only (must call manualSync())
```

---

## Support

### Firebase Documentation
- [Firebase Docs](https://firebase.google.com/docs)
- [Authentication Guide](https://firebase.google.com/docs/auth)
- [Realtime Database Guide](https://firebase.google.com/docs/database)

### Common Issues
- Check Firebase Console for errors
- Look at browser console (F12) for JavaScript errors
- Verify all configuration values are correct

---

## Summary Checklist

Before going live, verify:

- [ ] Firebase project created
- [ ] Email/password authentication enabled
- [ ] Realtime Database created and secured
- [ ] `firebase-config.js` updated with YOUR credentials
- [ ] `enabled: true` in firebase-config.js
- [ ] User accounts created for Dillyn and Ashlee
- [ ] Tested sign in/out on one device
- [ ] Tested sync across multiple devices
- [ ] Database rules published and secure

---

## Quick Reference

### Important URLs

- **Firebase Console**: https://console.firebase.google.com/
- **Your Project**: https://console.firebase.google.com/project/YOUR-PROJECT-ID

### Important Files

- `js/firebase-config.js` - Your configuration
- `js/firebase.js` - Firebase integration code
- `js/firebase-auth-handlers.js` - Authentication UI logic

### Key Commands (Browser Console)

```javascript
// Check Firebase status
FirebaseSync.getSyncStatus()

// Manual sync
manualSync()

// Export data
Storage.exportAllData()
```

---

**You're all set!** 🎉

Firebase is now configured for cross-device sync. Both Dillyn and Ashlee can access their data from any device!
