/**
 * Firebase Cloud Functions for Ashlyn Retreat
 * Handles secure Gemini API calls server-side
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Gemini AI with API key from environment
const genAI = new GoogleGenerativeAI(functions.config().gemini.apikey);

/**
 * Helper function to call Gemini API
 * Used internally by cloud functions
 */
async function callGeminiAPI(prompt, modelName = 'gemini-2.5-flash-lite', userId) {
    try {
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: modelName });

        // Generate content
        const result = await model.generateContent({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048
            }
        });

        const response = await result.response;
        const text = response.text();

        // Log usage for monitoring
        console.log(`Gemini API called by user ${userId}, model: ${modelName}`);

        return {
            success: true,
            response: text
        };

    } catch (error) {
        console.error('Gemini API error:', error);
        return {
            success: false,
            error: error.message || 'Failed to generate AI response'
        };
    }
}

/**
 * Cloud Function: callGemini
 * Securely calls Gemini API on behalf of authenticated users
 *
 * Request body:
 * - prompt: string (required) - The prompt to send to Gemini
 * - model: string (optional) - Model name, defaults to gemini-2.5-flash-lite
 *
 * Returns:
 * - success: boolean
 * - response: string (if successful)
 * - error: string (if failed)
 */
exports.callGemini = functions.https.onCall(async (data, context) => {
    // Verify user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'User must be authenticated to call Gemini API'
        );
    }

    // Validate input
    if (!data.prompt || typeof data.prompt !== 'string') {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Prompt is required and must be a string'
        );
    }

    // Get model name (default to flash-lite)
    const modelName = data.model || 'gemini-2.5-flash-lite';

    const result = await callGeminiAPI(data.prompt, modelName, context.auth.uid);

    if (!result.success) {
        throw new functions.https.HttpsError('internal', result.error);
    }

    return result;
});

/**
 * Cloud Function: analyzeDailyReflection
 * Specialized function for analyzing daily journal entries
 */
exports.analyzeDailyReflection = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }

    const prompt = `You are a supportive wellness and business coach analyzing a daily reflection from a retreat focused on entrepreneurship and personal growth.

Analyze this journal entry and provide:
1. Key insights (2-3 sentences)
2. One actionable suggestion
3. One encouraging message

Journal Entry:
Date: ${data.date || 'Not specified'}
Intention: ${data.intention || 'None'}
Energy Level: ${data.energy || 'Not specified'}/10

Key Insights: ${data.insights || 'None'}
Moments of Clarity: ${data.clarity || 'None'}
Challenges: ${data.challenges || 'None'}
Ideas Generated: ${data.ideas || 'None'}

Gratitude:
1. ${data.gratitude1 || 'None'}
2. ${data.gratitude2 || 'None'}
3. ${data.gratitude3 || 'None'}

Keep your response warm, supportive, and actionable. Focus on growth mindset and practical next steps.`;

    return await callGeminiAPI(prompt, 'gemini-2.5-flash-lite', context.auth.uid);
});

/**
 * Cloud Function: analyzeSWOT
 */
exports.analyzeSWOT = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }

    const prompt = `You are a business strategy consultant reviewing a SWOT analysis for a new business idea.

Business Idea: ${data.ideaName || 'Unnamed Business Idea'}

SWOT Analysis:
Strengths: ${data.strengths || 'Not specified'}
Weaknesses: ${data.weaknesses || 'Not specified'}
Opportunities: ${data.opportunities || 'Not specified'}
Threats: ${data.threats || 'Not specified'}

Provide:
1. Missing items in each quadrant (what they might have overlooked)
2. Strategic recommendations (2-3 key insights)
3. Priority actions (what to focus on first)

Be specific and actionable.`;

    return await callGeminiAPI(prompt, 'gemini-2.5-flash-lite', context.auth.uid);
});

/**
 * Cloud Function: analyzeIkigai
 */
exports.analyzeIkigai = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }

    const prompt = `You are a career coach analyzing an Ikigai diagram to help someone find their purpose.

Ikigai Elements:
- What I Love: ${data.love || 'Not specified'}
- What I'm Good At: ${data.goodAt || 'Not specified'}
- What I Can Be Paid For: ${data.paidFor || 'Not specified'}
- What The World Needs: ${data.worldNeeds || 'Not specified'}

Analyze:
1. How well aligned are these elements?
2. What overlaps or synergies do you see?
3. Suggest 1-2 potential business ideas that combine these elements
4. Identify any gaps or areas to develop

Be encouraging and visionary.`;

    return await callGeminiAPI(prompt, 'gemini-2.5-flash-lite', context.auth.uid);
});

/**
 * Cloud Function: analyzeValueProposition
 */
exports.analyzeValueProposition = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }

    const prompt = `You are a product strategist reviewing a Value Proposition Canvas.

Customer Profile:
- Jobs: ${data.customerJobs || 'Not specified'}
- Pains: ${data.pains || 'Not specified'}
- Gains: ${data.gains || 'Not specified'}

Value Map:
- Products/Services: ${data.products || 'Not specified'}
- Pain Relievers: ${data.painRelievers || 'Not specified'}
- Gain Creators: ${data.gainCreators || 'Not specified'}

Evaluate:
1. How well does the value map address the customer profile?
2. What's missing in addressing customer pains?
3. What additional gains could be created?
4. Rate the product-market fit (1-10) and explain why

Be constructive and specific.`;

    return await callGeminiAPI(prompt, 'gemini-2.5-flash-lite', context.auth.uid);
});

/**
 * Cloud Function: analyzeActionPlan
 */
exports.analyzeActionPlan = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }

    const prompt = `You are a business advisor reviewing a 90-day action plan for a new venture.

Business Idea: ${data.businessIdea || 'Not specified'}
Vision: ${data.vision || 'Not specified'}

Month 1 Goal: ${data.month1Goal || 'Not specified'}
Month 2 Goal: ${data.month2Goal || 'Not specified'}
Month 3 Goal: ${data.month3Goal || 'Not specified'}

Analyze:
1. Is this timeline realistic?
2. Are the goals specific and measurable enough?
3. What potential roadblocks might they face?
4. Suggest 2-3 adjustments to increase chances of success

Be realistic but encouraging.`;

    return await callGeminiAPI(prompt, 'gemini-2.5-flash-lite', context.auth.uid);
});

/**
 * Cloud Function: detectPatterns
 */
exports.detectPatterns = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
    }

    if (!Array.isArray(data.entries) || data.entries.length === 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Entries array required');
    }

    const entriesText = data.entries.map((entry, index) => {
        return `Entry ${index + 1} (${entry.date || 'No date'}):
Intention: ${entry.intention || 'None'}
Insights: ${entry.insights || 'None'}
Challenges: ${entry.challenges || 'None'}
---`;
    }).join('\n\n');

    const prompt = `You are analyzing multiple journal entries from a retreat participant to identify patterns and themes.

Entries:
${entriesText}

Identify:
1. Recurring themes or concerns
2. Progress or growth over time
3. Limiting beliefs that appear repeatedly
4. Strengths or positive patterns
5. One key recommendation for moving forward

Be insightful and compassionate.`;

    return await callGeminiAPI(prompt, 'gemini-2.5-flash-lite', context.auth.uid);
});
