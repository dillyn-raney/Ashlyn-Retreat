# GitHub Pages Deployment Guide

Deploy The Ashlyn Retreat app to GitHub Pages for free hosting.

**Time Required**: 5-10 minutes
**Cost**: FREE

---

## Prerequisites

- ✅ Firebase configured and Cloud Functions deployed
- ✅ Git installed
- ✅ GitHub account

---

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/)
2. Click **"New repository"** (+ icon, top right)
3. Repository name: `Ashlyn-Retreat` (or any name)
4. Make it **Private** (recommended for personal projects)
5. Don't initialize with README (we already have one)
6. Click **"Create repository"**

---

## Step 2: Initialize Git Locally (if not already done)

```bash
cd "D:\AI Artifacts\Ashlyn Retreat"
git init
git add .
git commit -m "Initial commit: Ashlyn Retreat app with Firebase and Gemini AI"
```

---

## Step 3: Connect to GitHub

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/Ashlyn-Retreat.git
git branch -M main
git push -u origin main
```

---

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Scroll to **"Pages"** in left sidebar
4. Under **"Source"**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **"Save"**
6. Wait ~1 minute for deployment
7. Your site will be available at: `https://YOUR_USERNAME.github.io/Ashlyn-Retreat/`

---

## Step 5: Authorize Domain in Firebase

**Important:** Firebase needs to allow your GitHub Pages domain.

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your `ashlyn-retreat` project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **"Add domain"**
5. Add: `YOUR_USERNAME.github.io`
6. Click **"Add"**

---

## Step 6: Test Deployment

1. Open: `https://YOUR_USERNAME.github.io/Ashlyn-Retreat/`
2. You should see the login screen
3. Sign in with your Firebase credentials
4. Test all features:
   - ✅ Journal entries sync
   - ✅ AI insights work
   - ✅ Data persists across page reloads

---

## Configuration Files

### What's Committed to GitHub

✅ **Safe to commit:**
- `firebase-config.js` - Firebase API keys are domain-restricted (safe)
- `gemini-config.js` - Empty API key (using Cloud Functions)
- All HTML/CSS/JS files

❌ **NOT committed (in .gitignore):**
- `functions/node_modules/`
- `.firebase/`
- `.firebaserc`

### Security Notes

**Firebase API Key:**
- ✅ Safe to expose in client code
- Protected by Firebase domain restrictions
- Only works on authorized domains

**Gemini API Key:**
- ✅ NOT in client code (using Cloud Functions)
- Stored securely in Firebase server-side
- Never exposed to users

---

## Updating Your Deployment

### After Making Changes

```bash
# Stage changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push
```

GitHub Pages will automatically redeploy (~1 minute).

---

## Custom Domain (Optional)

Want to use your own domain like `retreat.yourdomain.com`?

1. **Add CNAME record** in your domain registrar:
   - Type: `CNAME`
   - Name: `retreat` (or whatever subdomain)
   - Value: `YOUR_USERNAME.github.io`

2. **Configure in GitHub:**
   - Settings → Pages → Custom domain
   - Enter: `retreat.yourdomain.com`
   - Click Save

3. **Update Firebase authorized domains:**
   - Add `retreat.yourdomain.com` to Firebase Console

---

## Troubleshooting

### "Config files not found" (404 errors)

**Problem:** Config files weren't committed
**Solution:**
```bash
# Check if files exist
git ls-files js/firebase-config.js js/gemini-config.js

# If missing, add them
git add js/firebase-config.js js/gemini-config.js
git commit -m "Add config files"
git push
```

### "Auth domain not authorized"

**Problem:** GitHub Pages domain not authorized in Firebase
**Solution:** See Step 5 above - add domain to Firebase Console

### Login screen doesn't appear

**Problem:** Firebase not initializing
**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Verify `firebase-config.js` loaded
4. Verify `enabled: true` in firebaseFeatures

### Cloud Functions not working

**Problem:** Functions not accessible from GitHub Pages
**Solution:**
- Functions should work from any domain
- Check Firebase Console → Functions → Logs for errors
- Ensure functions are deployed: `firebase deploy --only functions`

### Changes not reflecting

**Problem:** Browser cache or GitHub Pages delay
**Solution:**
1. Hard refresh: Ctrl+F5 (or Cmd+Shift+R)
2. Wait 2-3 minutes for GitHub Pages to rebuild
3. Clear browser cache completely

---

## Monitoring

### Check Deployment Status

1. Go to your GitHub repository
2. Click **"Actions"** tab (if enabled)
3. Or check **"Environments"** → `github-pages`

### Firebase Usage

Monitor Firebase usage:
1. [Firebase Console](https://console.firebase.google.com/)
2. Go to Usage tab
3. Check:
   - Authentication users
   - Database reads/writes
   - Functions invocations

Should stay $0/month within free tier! 🎉

---

## Backup Strategy

### Local Backup

```bash
# Export data from browser console
Storage.exportAllData()
# Saves JSON file with all data
```

### Git Backup

Your code is already backed up on GitHub!

### Firebase Backup

Data is automatically backed up in Firebase Realtime Database.

---

## Privacy Settings

### Private Repository

If you made the repo private:
- ✅ Code is private
- ✅ GitHub Pages still works
- ✅ Only accessible via URL (not searchable)

### Public Repository

If public:
- ⚠️ Code is visible to everyone
- ✅ Firebase/Gemini keys are secure
- ✅ User data is protected (in Firebase, not in code)

---

## Performance

### Load Time

Expected first load: ~2-3 seconds
- HTML/CSS/JS from GitHub Pages CDN (fast!)
- Firebase SDK from Google CDN
- User data from Firebase (milliseconds)

### Caching

GitHub Pages automatically caches static files for better performance.

---

## Cost Summary

**GitHub Pages:** FREE ✅
**Firebase:** $0/month (free tier) ✅
**Cloud Functions:** $0/month (free tier) ✅
**Gemini API:** $0/month (free tier) ✅

**Total:** $0/month 🎉

---

## Quick Commands Reference

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Update message"

# Push to GitHub (triggers deployment)
git push

# View remote URL
git remote -v

# Pull latest changes
git pull

# View commit history
git log --oneline
```

---

## Support

### Resources

- **GitHub Pages Docs:** https://docs.github.com/en/pages
- **Firebase Console:** https://console.firebase.google.com/
- **Repository Settings:** https://github.com/YOUR_USERNAME/Ashlyn-Retreat/settings

### Common Issues

All troubleshooting in this guide, plus:
- Check [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
- Check [CLOUD_FUNCTIONS_SETUP.md](CLOUD_FUNCTIONS_SETUP.md)

---

## Summary

**Your deployment URL:**
```
https://YOUR_USERNAME.github.io/Ashlyn-Retreat/
```

**Features:**
- ✅ Free hosting on GitHub Pages
- ✅ HTTPS by default
- ✅ Firebase authentication and sync
- ✅ Secure Gemini AI via Cloud Functions
- ✅ Auto-deployment on git push
- ✅ Works on all devices

**Enjoy your deployed retreat planning app!** 🚀

---

**Deployed on:** _______________
**GitHub URL:** _______________
**Live URL:** _______________
