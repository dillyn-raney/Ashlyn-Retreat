# Gemini AI Setup Guide

Enable AI-powered insights for your journal entries and business planning tools!

**Time Required**: 5 minutes (Quick Start) or 15 minutes (Production Setup)
**Cost**: FREE (Gemini API has a generous free tier)

---

## 🔒 Production Setup (Recommended)

**For secure, production-ready deployment:**

This guide shows the quick client-side setup for testing. **For production**, you should use Firebase Cloud Functions to keep your API key secure.

👉 **See [CLOUD_FUNCTIONS_SETUP.md](CLOUD_FUNCTIONS_SETUP.md) for secure production deployment**

Benefits of Cloud Functions:
- ✅ API key stays server-side (never exposed)
- ✅ Only authenticated users can call Gemini
- ✅ Better rate limiting and cost control
- ✅ More secure and professional

---

## Quick Start (Client-Side Testing)

Use this method for local testing only. Follow these steps:

---

## 🤖 What You Get

With Gemini AI enabled, you'll receive intelligent feedback on:

### Journaling:
- 💭 **Daily Reflections** - AI analyzes your entries and provides insights
- 🎯 **Action Suggestions** - Get personalized recommendations
- 📈 **Pattern Detection** - Identify recurring themes across multiple entries
- 💡 **Encouragement** - Supportive messages based on your progress

### Business Planning:
- 📊 **SWOT Analysis** - AI identifies missing elements and strategic opportunities
- 🎨 **Ikigai Review** - Get alignment suggestions and business idea recommendations
- 💼 **Value Proposition** - Evaluate product-market fit with AI feedback
- ✅ **90-Day Plan** - AI assesses timeline feasibility and suggests improvements
- 🔄 **Kanban Prioritization** - Get help prioritizing your ideas

---

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API key"**
4. Select **"Create API key in new project"** (or use existing project)
5. Copy the API key (starts with `AIza...`)
6. **Keep this key secret!** Don't share it publicly

---

## Step 2: Configure the App

1. Open `js/gemini-config.js` in your app folder

2. Replace `YOUR_GEMINI_API_KEY` with your actual API key:

```javascript
const geminiConfig = {
    enabled: true,  // ← Change from false to true
    apiKey: "AIza...",  // ← Paste your API key here
    model: "gemini-1.5-flash",
    // ... rest of config
};
```

3. **Set enabled to `true`**:

```javascript
enabled: true,  // Must be true to enable Gemini
```

4. Save the file

---

## Step 3: Test It!

1. **Refresh your app** (hard refresh: Ctrl+F5)
2. Go to the **Journal** section
3. Fill out a **Daily Reflection** with some content
4. Click the **"Get AI Insights"** button (blue button with star icon)
5. Wait a few seconds
6. See AI-powered insights appear!

---

## 🎯 Features in Detail

### Daily Reflection Analysis

**What it does:**
- Analyzes your intention, insights, challenges, and gratitude
- Provides 2-3 key observations
- Suggests one actionable next step
- Offers encouraging feedback

**How to use:**
1. Fill out your daily reflection
2. Click **"Get AI Insights"**
3. Read the AI feedback
4. Use suggestions to improve your practice

### SWOT Analysis

**What it does:**
- Reviews your strengths, weaknesses, opportunities, threats
- Identifies missing items you may have overlooked
- Provides strategic recommendations
- Suggests priority actions

**How to use:**
1. Complete your SWOT analysis
2. Click **"Analyze with AI"**
3. Review AI suggestions
4. Add missing items to your SWOT

### Ikigai Analysis

**What it does:**
- Evaluates alignment of your four circles
- Identifies synergies and overlaps
- Suggests 1-2 potential business ideas
- Highlights gaps to develop

**How to use:**
1. Fill in all four Ikigai fields
2. Click **"Get AI Insights"**
3. Review business idea suggestions
4. Consider gaps identified

### Value Proposition Canvas

**What it does:**
- Assesses product-market fit
- Identifies missing pain relievers
- Suggests additional gain creators
- Rates fit on 1-10 scale with explanation

**How to use:**
1. Complete both customer profile and value map
2. Click **"Analyze with AI"**
3. Review fit assessment
4. Improve your value proposition

### 90-Day Action Plan

**What it does:**
- Evaluates timeline realism
- Checks if goals are specific/measurable
- Identifies potential roadblocks
- Suggests adjustments for success

**How to use:**
1. Fill out your 3-month plan
2. Click **"Get AI Feedback"**
3. Review feasibility assessment
4. Adjust timeline if needed

### Pattern Detection

**What it does:**
- Analyzes multiple journal entries
- Identifies recurring themes
- Tracks progress over time
- Spots limiting beliefs
- Highlights positive patterns
- Provides key recommendations

**How to use:**
1. Write at least 2 daily reflections
2. Go to **Journal → View All**
3. Click **"Detect Patterns"**
4. Review cross-entry analysis

---

## ⚙️ Configuration Options

### Change AI Model

In `gemini-config.js`:

```javascript
model: "gemini-1.5-flash",  // Fast, efficient (recommended)
// OR
model: "gemini-1.5-pro",     // More capable, slower
```

**Flash** is faster and cheaper (good for this app)
**Pro** is more intelligent but costs more

### Adjust Rate Limits

To avoid excessive API calls:

```javascript
rateLimiting: {
    maxRequestsPerHour: 20,   // Max 20 requests per hour
    maxRequestsPerDay: 100    // Max 100 requests per day
}
```

Increase or decrease based on your usage.

### Toggle Features

Enable/disable specific AI features:

```javascript
features: {
    journalInsights: true,      // AI on journal entries
    businessAnalysis: true,      // AI on business tools
    actionSuggestions: true,     // AI action suggestions
    patternDetection: true,      // Pattern analysis
    encouragement: true          // Encouraging messages
}
```

Set any to `false` to disable that feature.

---

## 💰 Cost & Limits

### Gemini API Free Tier

**Gemini 1.5 Flash** (recommended):
- **60 requests per minute**
- **1,500 requests per day**
- **FREE** up to 1 million tokens/month

With this app's rate limits (100/day), you'll **never pay anything!** 🎉

### If You Exceed Free Tier

Very unlikely with this app, but:
- First 1M tokens/month: **FREE**
- After that: Very cheap ($0.075 per 1M tokens)

You'd need to make thousands of requests to pay anything.

---

## 🔒 Security Notes

### Keep Your API Key Secret

**DO:**
- ✅ Keep API key in `gemini-config.js` locally
- ✅ Add `gemini-config.js` to `.gitignore`
- ✅ Use environment variables in production

**DON'T:**
- ❌ Commit API key to public GitHub repos
- ❌ Share your API key with others
- ❌ Hardcode in production apps

### For Production (GitHub Pages, etc.)

If deploying publicly, you should:
1. Use Firebase Cloud Functions instead of client-side API calls
2. Store API key in Firebase environment config
3. Rate-limit by user authentication

For this personal retreat app, client-side is fine if you:
- Keep the repo private OR
- Don't commit the actual API key

---

## 🐛 Troubleshooting

### "Gemini AI not initialized"

**Problem**: API key not configured
**Solution**:
1. Check `gemini-config.js`
2. Ensure `enabled: true`
3. Ensure API key is correct

### "Hourly limit reached"

**Problem**: Made too many requests
**Solution**:
1. Wait an hour
2. Increase limit in `gemini-config.js`

### "API error: 400"

**Problem**: Invalid API request
**Solution**:
1. Check API key is correct
2. Ensure using valid Gemini model name
3. Check console for detailed error

### "API error: 403"

**Problem**: API key invalid or restricted
**Solution**:
1. Verify API key is copied correctly
2. Check API key hasn't been deleted in Google AI Studio
3. Create a new API key

### No AI buttons appearing

**Problem**: Gemini not enabled or initialized
**Solution**:
1. Check `enabled: true` in gemini-config.js
2. Hard refresh browser (Ctrl+F5)
3. Check console for errors

### AI responses are slow

**Problem**: Using `gemini-1.5-pro` model
**Solution**:
1. Switch to `gemini-1.5-flash` for faster responses
2. This is normal - AI analysis takes a few seconds

---

## 💡 Tips for Best Results

### Journal Entries

**DO:**
- Write detailed, specific entries
- Be honest about challenges
- Include concrete examples
- Use complete sentences

**Better insights come from better input!**

### Business Tools

**DO:**
- Fill out all fields before asking for AI
- Be specific (avoid vague statements)
- Include measurable goals
- Describe your target customer clearly

**The more detail you provide, the better the AI feedback!**

---

## 🔄 Workflow Examples

### Daily Journaling with AI

1. Write your daily reflection
2. Get AI insights
3. Review suggestions
4. Add suggested action items
5. Reflect on AI feedback in next entry

### Business Planning with AI

1. Brainstorm your SWOT
2. Get AI analysis
3. Add missing items AI identified
4. Create Ikigai based on SWOT
5. Get AI suggestions for business ideas
6. Develop Value Proposition
7. Get AI product-market fit assessment
8. Build 90-Day Plan
9. Get AI feasibility check
10. Refine plan based on AI feedback

---

## 📊 Usage Monitoring

### Check Your Usage

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click on your API key
3. View usage statistics
4. See requests per day/month

### In Browser Console

```javascript
// Check rate limit status
console.log(GeminiAI.requestCount);

// Output:
// { hour: 5, day: 23, lastHourReset: ..., lastDayReset: ... }
```

---

## 🚀 Advanced Usage

### Custom Prompts

You can customize AI prompts in `gemini-config.js`:

```javascript
prompts: {
    dailyReflection: `Your custom prompt here...`
}
```

### Add New AI Features

The framework is extensible. You can:
1. Add new analysis functions in `gemini.js`
2. Add new UI buttons in `gemini-ui.js`
3. Create custom prompts in `gemini-config.js`

---

## 📚 Resources

- **Gemini API Docs**: https://ai.google.dev/docs
- **Google AI Studio**: https://makersuite.google.com
- **Pricing**: https://ai.google.dev/pricing
- **Models**: https://ai.google.dev/models/gemini

---

## ✅ Quick Start Checklist

Before using Gemini AI:

- [ ] Created Gemini API key
- [ ] Updated `gemini-config.js` with API key
- [ ] Set `enabled: true` in config
- [ ] Hard refreshed browser
- [ ] Tested with a journal entry
- [ ] Saw AI insights appear
- [ ] Explored all AI features

---

## 🎉 Summary

Gemini AI adds powerful insights to your retreat experience:
- ✨ Intelligent feedback on journaling
- 🎯 Strategic business advice
- 📈 Pattern recognition
- 💡 Actionable suggestions
- 💰 **Completely FREE** for this use case

**Setup time**: 5 minutes
**Cost**: $0
**Value**: Priceless! 🌟

Enjoy your AI-enhanced retreat planning!
