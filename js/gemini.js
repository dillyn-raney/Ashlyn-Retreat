// Gemini AI Integration for Ashlyn Retreat
// Provides AI-powered insights on journal entries and business planning

const GeminiAI = {
    initialized: false,
    requestCount: {
        hour: 0,
        day: 0,
        lastHourReset: Date.now(),
        lastDayReset: Date.now()
    },

    // Initialize Gemini AI
    init() {
        if (!window.geminiConfig || !window.geminiConfig.enabled) {
            console.log('Gemini AI disabled in config');
            return false;
        }

        if (!window.geminiConfig.apiKey || window.geminiConfig.apiKey === 'YOUR_GEMINI_API_KEY') {
            console.warn('Gemini API key not configured');
            return false;
        }

        this.initialized = true;
        console.log('Gemini AI initialized');
        return true;
    },

    // Check rate limiting
    checkRateLimit() {
        const now = Date.now();
        const config = window.geminiConfig;

        // Reset hour counter if needed
        if (now - this.requestCount.lastHourReset > 3600000) {
            this.requestCount.hour = 0;
            this.requestCount.lastHourReset = now;
        }

        // Reset day counter if needed
        if (now - this.requestCount.lastDayReset > 86400000) {
            this.requestCount.day = 0;
            this.requestCount.lastDayReset = now;
        }

        // Check limits
        if (this.requestCount.hour >= config.rateLimiting.maxRequestsPerHour) {
            return { allowed: false, reason: 'Hourly limit reached' };
        }

        if (this.requestCount.day >= config.rateLimiting.maxRequestsPerDay) {
            return { allowed: false, reason: 'Daily limit reached' };
        }

        return { allowed: true };
    },

    // Increment request counter
    incrementRequestCount() {
        this.requestCount.hour++;
        this.requestCount.day++;
    },

    // Call Gemini API
    async callGemini(prompt) {
        if (!this.initialized) {
            return { success: false, error: 'Gemini AI not initialized' };
        }

        const rateCheck = this.checkRateLimit();
        if (!rateCheck.allowed) {
            return { success: false, error: rateCheck.reason };
        }

        try {
            const config = window.geminiConfig;
            const url = `${config.apiEndpoint}/${config.model}:generateContent?key=${config.apiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048  // Increased to allow for thinking tokens + response
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            this.incrementRequestCount();

            // Debug: Log the full response to see structure
            console.log('Gemini API Response:', data);

            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                return {
                    success: true,
                    response: data.candidates[0].content.parts[0].text
                };
            } else {
                // Check if we hit max tokens
                const finishReason = data.candidates?.[0]?.finishReason;
                if (finishReason === 'MAX_TOKENS') {
                    console.warn('Response cut off due to max tokens. Increase maxOutputTokens.');
                    return { success: false, error: 'Response too long. Please try again.' };
                }
                console.warn('Unexpected response structure:', JSON.stringify(data, null, 2));
                return { success: false, error: 'No response from API' };
            }

        } catch (error) {
            console.error('Gemini API error:', error);
            return { success: false, error: error.message };
        }
    },

    // Analyze daily reflection
    async analyzeDailyReflection(reflectionData) {
        if (!window.geminiConfig.features.journalInsights) {
            return null;
        }

        const entryText = `
Date: ${reflectionData.date || 'Not specified'}
Intention: ${reflectionData.intention || 'None'}
Energy Level: ${reflectionData.energy || 'Not specified'}/10

Key Insights: ${reflectionData.insights || 'None'}
Moments of Clarity: ${reflectionData.clarity || 'None'}
Challenges: ${reflectionData.challenges || 'None'}
Ideas Generated: ${reflectionData.ideas || 'None'}

Gratitude:
1. ${reflectionData.gratitude1 || 'None'}
2. ${reflectionData.gratitude2 || 'None'}
3. ${reflectionData.gratitude3 || 'None'}
        `.trim();

        const prompt = window.geminiConfig.prompts.dailyReflection.replace('{entry}', entryText);
        return await this.callGemini(prompt);
    },

    // Analyze SWOT
    async analyzeSWOT(swotData) {
        if (!window.geminiConfig.features.businessAnalysis) {
            return null;
        }

        const prompt = window.geminiConfig.prompts.swotAnalysis
            .replace('{ideaName}', swotData.ideaName || 'Unnamed Business Idea')
            .replace('{strengths}', swotData.strengths || 'Not specified')
            .replace('{weaknesses}', swotData.weaknesses || 'Not specified')
            .replace('{opportunities}', swotData.opportunities || 'Not specified')
            .replace('{threats}', swotData.threats || 'Not specified');

        return await this.callGemini(prompt);
    },

    // Analyze Ikigai
    async analyzeIkigai(ikigaiData) {
        if (!window.geminiConfig.features.businessAnalysis) {
            return null;
        }

        const prompt = window.geminiConfig.prompts.ikigaiAnalysis
            .replace('{love}', ikigaiData.love || 'Not specified')
            .replace('{goodAt}', ikigaiData.goodAt || 'Not specified')
            .replace('{paidFor}', ikigaiData.paidFor || 'Not specified')
            .replace('{worldNeeds}', ikigaiData.worldNeeds || 'Not specified');

        return await this.callGemini(prompt);
    },

    // Analyze Value Proposition Canvas
    async analyzeValueProposition(valueData) {
        if (!window.geminiConfig.features.businessAnalysis) {
            return null;
        }

        const prompt = window.geminiConfig.prompts.valuePropositionAnalysis
            .replace('{customerJobs}', valueData.customerJobs || 'Not specified')
            .replace('{pains}', valueData.pains || 'Not specified')
            .replace('{gains}', valueData.gains || 'Not specified')
            .replace('{products}', valueData.products || 'Not specified')
            .replace('{painRelievers}', valueData.painRelievers || 'Not specified')
            .replace('{gainCreators}', valueData.gainCreators || 'Not specified');

        return await this.callGemini(prompt);
    },

    // Analyze 90-Day Action Plan
    async analyzeActionPlan(planData) {
        if (!window.geminiConfig.features.businessAnalysis) {
            return null;
        }

        const prompt = window.geminiConfig.prompts.actionPlanAnalysis
            .replace('{businessIdea}', planData.businessIdea || 'Not specified')
            .replace('{vision}', planData.vision || 'Not specified')
            .replace('{month1Goal}', planData.month1Goal || 'Not specified')
            .replace('{month2Goal}', planData.month2Goal || 'Not specified')
            .replace('{month3Goal}', planData.month3Goal || 'Not specified');

        return await this.callGemini(prompt);
    },

    // Detect patterns in multiple journal entries
    async detectPatterns(journalEntries) {
        if (!window.geminiConfig.features.patternDetection) {
            return null;
        }

        if (!Array.isArray(journalEntries) || journalEntries.length === 0) {
            return { success: false, error: 'No journal entries provided' };
        }

        // Format entries for analysis
        const entriesText = journalEntries.map((entry, index) => {
            return `Entry ${index + 1} (${entry.date || 'No date'}):
Intention: ${entry.intention || 'None'}
Insights: ${entry.insights || 'None'}
Challenges: ${entry.challenges || 'None'}
---`;
        }).join('\n\n');

        const prompt = window.geminiConfig.prompts.patternDetection.replace('{entries}', entriesText);
        return await this.callGemini(prompt);
    },

    // Get AI suggestion for specific field
    async getSuggestion(context, fieldType) {
        if (!window.geminiConfig.features.actionSuggestions) {
            return null;
        }

        let prompt = '';

        switch (fieldType) {
            case 'intention':
                prompt = `Based on this context: "${context}", suggest a powerful daily intention (one sentence) that's specific and actionable.`;
                break;
            case 'actionItem':
                prompt = `Based on these insights: "${context}", suggest one concrete action item that can be completed today.`;
                break;
            case 'gratitude':
                prompt = `Given this reflection: "${context}", suggest something specific to be grateful for related to personal or business growth.`;
                break;
            default:
                return { success: false, error: 'Unknown field type' };
        }

        return await this.callGemini(prompt);
    },

    // Get encouragement based on current state
    async getEncouragement(mood, progress) {
        if (!window.geminiConfig.features.encouragement) {
            return null;
        }

        const prompt = `Provide a short (2-3 sentences) encouraging message for someone on an entrepreneurial retreat who is feeling ${mood} and has made ${progress} progress. Be warm, supportive, and motivating.`;

        return await this.callGemini(prompt);
    }
};

// Export for use in other modules
window.GeminiAI = GeminiAI;
