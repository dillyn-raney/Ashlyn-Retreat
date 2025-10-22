// Gemini AI Configuration
// For AI-powered insights on journal entries and business planning

const geminiConfig = {
    // Set to true to enable Gemini AI features
    enabled: true,

    // Use Firebase Cloud Functions for secure API calls (RECOMMENDED)
    // API key is stored securely in Firebase Functions environment
    useCloudFunctions: true,

    // Client-side API key - NOT USED when useCloudFunctions is true
    // Leave empty for production - API key is in Cloud Functions
    apiKey: "",

    // Gemini model to use
    model: "gemini-2.5-flash-lite", // Fastest and most cost-efficient (no extended thinking)
    // model: "gemini-2.5-flash", // Fast and efficient, balanced model (uses extended thinking)
    // model: "gemini-2.5-pro", // Most powerful for complex reasoning

    // API endpoint (not used with Cloud Functions)
    apiEndpoint: "https://generativelanguage.googleapis.com/v1beta/models",

    // Feature toggles
    features: {
        journalInsights: true,      // AI insights on journal entries
        businessAnalysis: true,      // AI analysis of business tools
        actionSuggestions: true,     // AI-suggested action items
        patternDetection: true,      // Detect patterns in journal entries
        encouragement: true          // Encouraging messages
    },

    // Rate limiting (to avoid excessive API calls)
    rateLimiting: {
        maxRequestsPerHour: 20,
        maxRequestsPerDay: 100
    },

    // Prompt templates
    prompts: {
        // Daily reflection analysis
        dailyReflection: `You are a supportive wellness and business coach analyzing a daily reflection from a retreat focused on entrepreneurship and personal growth.

Analyze this journal entry and provide:
1. Key insights (2-3 sentences)
2. One actionable suggestion
3. One encouraging message

Journal Entry:
{entry}

Keep your response warm, supportive, and actionable. Focus on growth mindset and practical next steps.`,

        // SWOT analysis
        swotAnalysis: `You are a business strategy consultant reviewing a SWOT analysis for a new business idea.

Business Idea: {ideaName}

SWOT Analysis:
Strengths: {strengths}
Weaknesses: {weaknesses}
Opportunities: {opportunities}
Threats: {threats}

Provide:
1. Missing items in each quadrant (what they might have overlooked)
2. Strategic recommendations (2-3 key insights)
3. Priority actions (what to focus on first)

Be specific and actionable.`,

        // Ikigai analysis
        ikigaiAnalysis: `You are a career coach analyzing an Ikigai diagram to help someone find their purpose.

Ikigai Elements:
- What I Love: {love}
- What I'm Good At: {goodAt}
- What I Can Be Paid For: {paidFor}
- What The World Needs: {worldNeeds}

Analyze:
1. How well aligned are these elements?
2. What overlaps or synergies do you see?
3. Suggest 1-2 potential business ideas that combine these elements
4. Identify any gaps or areas to develop

Be encouraging and visionary.`,

        // Value Proposition Canvas
        valuePropositionAnalysis: `You are a product strategist reviewing a Value Proposition Canvas.

Customer Profile:
- Jobs: {customerJobs}
- Pains: {pains}
- Gains: {gains}

Value Map:
- Products/Services: {products}
- Pain Relievers: {painRelievers}
- Gain Creators: {gainCreators}

Evaluate:
1. How well does the value map address the customer profile?
2. What's missing in addressing customer pains?
3. What additional gains could be created?
4. Rate the product-market fit (1-10) and explain why

Be constructive and specific.`,

        // 90-Day Action Plan
        actionPlanAnalysis: `You are a business advisor reviewing a 90-day action plan for a new venture.

Business Idea: {businessIdea}
Vision: {vision}

Month 1 Goal: {month1Goal}
Month 2 Goal: {month2Goal}
Month 3 Goal: {month3Goal}

Analyze:
1. Is this timeline realistic?
2. Are the goals specific and measurable enough?
3. What potential roadblocks might they face?
4. Suggest 2-3 adjustments to increase chances of success

Be realistic but encouraging.`,

        // Pattern detection in multiple journal entries
        patternDetection: `You are analyzing multiple journal entries from a retreat participant to identify patterns and themes.

Entries:
{entries}

Identify:
1. Recurring themes or concerns
2. Progress or growth over time
3. Limiting beliefs that appear repeatedly
4. Strengths or positive patterns
5. One key recommendation for moving forward

Be insightful and compassionate.`
    }
};

// Export config
window.geminiConfig = geminiConfig;
