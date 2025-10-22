# Firebase Cloud Functions Setup Guide

This guide will help you deploy secure Firebase Cloud Functions for Gemini AI integration.

**Time Required**: 10-15 minutes
**Cost**: FREE (Firebase free tier includes 125K invocations/month)

---

## Why Cloud Functions?

✅ **Security**: API key stays on the server, never exposed to clients
✅ **Authentication**: Only authenticated users can call Gemini
✅ **Rate Limiting**: Better control over API usage
✅ **Cost Control**: Prevent unauthorized API usage
✅ **Easy Updates**: Change prompts without updating client code

---

## Prerequisites

Before starting, ensure you have:
- ✅ Firebase project created (from FIREBASE_SETUP.md)
- ✅ Firebase CLI installed globally
- ✅ Gemini API key (from GEMINI_SETUP.md)
- ✅ Node.js 18+ installed

---

## Step 1: Login to Firebase

Open your terminal and login to Firebase:

```bash
firebase login
```

This will open a browser window. Sign in with your Google account that has access to your Firebase project.

---

## Step 2: Link Your Firebase Project

Navigate to your project directory and link it to your Firebase project:

```bash
cd "D:\AI Artifacts\Ashlyn Retreat"
firebase use --add
```

Select your Firebase project from the list (e.g., `ashlyn-retreat`).

---

## Step 3: Set Gemini API Key as Environment Variable

Store your Gemini API key securely in Firebase environment config:

```bash
firebase functions:config:set gemini.apikey="YOUR_GEMINI_API_KEY_HERE"
```

**Replace** `YOUR_GEMINI_API_KEY_HERE` with your actual Gemini API key.

**Example:**
```bash
firebase functions:config:set gemini.apikey="AIzaSyCaWDDzHH3_FL-AIQdcaNGw0MCURkaREjw"
```

---

## Step 4: Deploy Cloud Functions

Deploy all the cloud functions to Firebase:

```bash
firebase deploy --only functions
```

This will:
- Upload your functions to Firebase
- Install dependencies on the server
- Make the functions available at unique URLs

**Expected output:**
```
✔  functions: Finished running predeploy script.
✔  functions[callGemini]: Successful create operation.
✔  functions[analyzeDailyReflection]: Successful create operation.
✔  functions[analyzeSWOT]: Successful create operation.
✔  functions[analyzeIkigai]: Successful create operation.
✔  functions[analyzeValueProposition]: Successful create operation.
✔  functions[analyzeActionPlan]: Successful create operation.
✔  functions[detectPatterns]: Successful create operation.

✔  Deploy complete!
```

---

## Step 5: Update Gemini Config

Update `js/gemini-config.js` to indicate you're using cloud functions:

```javascript
const geminiConfig = {
    enabled: true,

    // Set to true when using Firebase Cloud Functions
    useCloudFunctions: true,

    // API key is no longer needed client-side!
    // apiKey is now stored securely in Firebase

    // ... rest of config stays the same
};
```

---

## Step 6: Test the Integration

1. **Hard refresh** your browser (Ctrl+F5)
2. Sign in to your app
3. Go to **Journal** → **Daily Reflection**
4. Fill out a reflection
5. Click **"Get AI Insights"**
6. ✨ AI insights should appear!

---

## Deployed Functions

After deployment, you'll have these cloud functions:

### Core Function
- **callGemini** - Generic function for any Gemini prompt

### Specialized Functions
- **analyzeDailyReflection** - Journal entry analysis
- **analyzeSWOT** - SWOT analysis review
- **analyzeIkigai** - Ikigai alignment analysis
- **analyzeValueProposition** - Product-market fit evaluation
- **analyzeActionPlan** - 90-day plan assessment
- **detectPatterns** - Multi-entry pattern detection

---

## Monitoring Usage

### View Function Logs

See real-time logs from your functions:

```bash
firebase functions:log
```

### View in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Functions** in left sidebar
4. See usage statistics and logs

### Check Gemini Usage

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. View API usage statistics
3. Monitor requests per day

---

## Cost Breakdown

### Firebase Cloud Functions (Free Tier)

- **125,000 invocations/month** - FREE
- **40,000 GB-seconds/month** - FREE
- **40,000 CPU-seconds/month** - FREE
- **5 GB network egress/month** - FREE

**Your usage:** With 2 users making ~100 AI requests/day = ~6,000/month
**Result:** ✅ Completely FREE!

### Gemini API (Free Tier)

- **1,500 requests/day** - FREE
- **60 requests/minute** - FREE

**Your usage:** ~100 requests/day
**Result:** ✅ Completely FREE!

**Total Cost:** $0/month 🎉

---

## Security Features

### Authentication Required

All functions check authentication:

```javascript
if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
}
```

Only signed-in users can call Gemini AI.

### API Key Protected

- ✅ API key stored server-side only
- ✅ Never exposed to client code
- ✅ Can't be extracted from browser
- ✅ Safe to deploy publicly

### Rate Limiting

Client-side rate limiting prevents abuse:
- 20 requests per hour per user
- 100 requests per day per user

---

## Updating Functions

### Update Function Code

1. Edit `functions/index.js`
2. Deploy changes:

```bash
firebase deploy --only functions
```

### Update Single Function

Deploy just one function:

```bash
firebase deploy --only functions:analyzeDailyReflection
```

### Update Environment Variables

Change the Gemini API key:

```bash
firebase functions:config:set gemini.apikey="NEW_API_KEY"
firebase deploy --only functions
```

---

## Troubleshooting

### "Error: HTTP Error: 403, Permission denied"

**Problem:** Firebase project doesn't have Functions enabled
**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Functions** → **Get Started**
4. Enable Cloud Functions for Firebase

### "firebase: command not found"

**Problem:** Firebase CLI not installed
**Solution:**
```bash
npm install -g firebase-tools
```

### "Error: No project active"

**Problem:** Project not linked
**Solution:**
```bash
firebase use --add
```

### Functions deploy fails

**Problem:** Node.js version mismatch
**Solution:** Cloud Functions require Node.js 18. Update locally:
```bash
nvm install 18
nvm use 18
```

### "Invalid API key" in function logs

**Problem:** Gemini API key not set correctly
**Solution:**
```bash
firebase functions:config:get
# Should show: { "gemini": { "apikey": "AIza..." } }

# If not, set it again:
firebase functions:config:set gemini.apikey="YOUR_KEY"
firebase deploy --only functions
```

### "User must be authenticated" error

**Problem:** User not signed in
**Solution:** Ensure user is logged in to Firebase Authentication before calling functions

---

## Local Testing (Optional)

Test functions locally before deploying:

### 1. Install Emulator Suite

```bash
firebase init emulators
```

Select **Functions Emulator**.

### 2. Start Emulators

```bash
firebase emulators:start
```

### 3. Update Client Code

Point to local functions (for testing only):

```javascript
// In gemini-cloud.js
const functions = firebase.functions();
functions.useEmulator('localhost', 5001); // For testing only
```

**Remember to remove this before deploying!**

---

## Rollback to Client-Side API (If Needed)

If you need to rollback to direct Gemini API calls:

1. Update `index.html`:
```html
<!-- Change this: -->
<script src="js/gemini-cloud.js"></script>

<!-- Back to: -->
<script src="js/gemini.js"></script>
```

2. Update `gemini-config.js`:
```javascript
apiKey: "YOUR_API_KEY", // Add API key back
useCloudFunctions: false, // Disable cloud functions
```

3. Hard refresh browser

---

## Best Practices

### 1. Monitor Usage

Check Firebase Console weekly:
- Function invocations
- Error rates
- Execution times

### 2. Set Budget Alerts

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **Billing** → **Budgets & alerts**
4. Set alert at $5 (you won't reach it, but good to have)

### 3. Keep Functions Updated

Update dependencies quarterly:

```bash
cd functions
npm update
firebase deploy --only functions
```

### 4. Backup Function Code

Functions are in `functions/index.js` - commit to git:

```bash
git add functions/
git commit -m "Cloud functions backup"
```

---

## Summary Checklist

Before going live with Cloud Functions:

- [ ] Firebase CLI installed and logged in
- [ ] Firebase project linked (`firebase use --add`)
- [ ] Gemini API key set as environment variable
- [ ] Functions deployed successfully
- [ ] `gemini-config.js` updated with `useCloudFunctions: true`
- [ ] Tested "Get AI Insights" button
- [ ] Verified functions in Firebase Console
- [ ] Checked function logs for errors
- [ ] Removed API key from `gemini-config.js`

---

## Quick Reference

### Common Commands

```bash
# Login
firebase login

# Link project
firebase use --add

# Set API key
firebase functions:config:set gemini.apikey="YOUR_KEY"

# Deploy all functions
firebase deploy --only functions

# Deploy single function
firebase deploy --only functions:callGemini

# View logs
firebase functions:log

# Check config
firebase functions:config:get

# Start local emulator
firebase emulators:start
```

### File Structure

```
Ashlyn Retreat/
├── functions/
│   ├── index.js           # Cloud functions code
│   ├── package.json       # Dependencies
│   └── node_modules/      # Installed packages
├── firebase.json          # Firebase config
└── js/
    ├── gemini-cloud.js    # Client that calls cloud functions
    └── gemini-config.js   # Configuration
```

---

## Additional Resources

- **Firebase Functions Docs**: https://firebase.google.com/docs/functions
- **Gemini API Docs**: https://ai.google.dev/docs
- **Firebase Console**: https://console.firebase.google.com/
- **Google Cloud Console**: https://console.cloud.google.com/

---

**You're all set!** 🎉

Your Gemini API key is now secure, and all AI calls go through authenticated Firebase Cloud Functions!
