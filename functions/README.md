# Firebase Cloud Functions

Secure server-side implementation of Gemini AI for Ashlyn Retreat.

## Functions

### Core Function
- **callGemini** - Generic Gemini API call with authentication

### Specialized Analysis Functions
- **analyzeDailyReflection** - Journal entry insights
- **analyzeSWOT** - SWOT analysis review
- **analyzeIkigai** - Ikigai alignment analysis
- **analyzeValueProposition** - Product-market fit evaluation
- **analyzeActionPlan** - 90-day plan assessment
- **detectPatterns** - Multi-entry pattern detection

## Setup

See [CLOUD_FUNCTIONS_SETUP.md](../CLOUD_FUNCTIONS_SETUP.md) in the parent directory.

## Quick Deploy

```bash
# Set API key
firebase functions:config:set gemini.apikey="YOUR_KEY"

# Deploy all functions
firebase deploy --only functions

# Deploy single function
firebase deploy --only functions:callGemini
```

## Local Testing

```bash
# Install dependencies
npm install

# Start emulator
firebase emulators:start --only functions

# In another terminal, run tests
npm test
```

## Environment Variables

### Production
Set via Firebase CLI:
```bash
firebase functions:config:set gemini.apikey="YOUR_KEY"
```

### Local (.runtimeconfig.json)
For local emulator testing, create `.runtimeconfig.json`:
```json
{
  "gemini": {
    "apikey": "YOUR_KEY"
  }
}
```

**⚠️ Never commit .runtimeconfig.json to git!**

## Monitoring

### View Logs
```bash
firebase functions:log
```

### Firebase Console
https://console.firebase.google.com/project/YOUR_PROJECT/functions

## Security

- ✅ All functions require authentication
- ✅ API key stored server-side only
- ✅ HTTPS only
- ✅ CORS enabled for Firebase domains only

## Dependencies

- `firebase-admin` - Firebase Admin SDK
- `firebase-functions` - Cloud Functions SDK
- `@google/generative-ai` - Gemini AI SDK

## Cost

Firebase Free Tier:
- 125,000 invocations/month - FREE
- 40,000 GB-seconds/month - FREE

Estimated usage: ~6,000 invocations/month
**Cost: $0/month** 🎉
