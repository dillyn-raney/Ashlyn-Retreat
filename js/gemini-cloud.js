/**
 * Gemini Cloud Functions Client
 * Calls Firebase Cloud Functions instead of Gemini API directly
 * This is more secure as the API key is stored server-side
 */

const GeminiCloud = {
    initialized: false,
    requestCount: {
        hour: 0,
        day: 0,
        lastHourReset: Date.now(),
        lastDayReset: Date.now()
    },

    // Initialize
    init() {
        if (!window.geminiConfig || !window.geminiConfig.enabled) {
            console.log('Gemini AI disabled in config');
            return false;
        }

        // Check if Firebase Functions is available
        if (!firebase.functions) {
            console.error('Firebase Functions not available');
            return false;
        }

        this.initialized = true;
        console.log('Gemini Cloud Functions initialized');
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

    // Call cloud function
    async callCloudFunction(functionName, data) {
        if (!this.initialized) {
            return { success: false, error: 'Gemini Cloud Functions not initialized' };
        }

        const rateCheck = this.checkRateLimit();
        if (!rateCheck.allowed) {
            return { success: false, error: rateCheck.reason };
        }

        try {
            const functions = firebase.functions();
            const callable = functions.httpsCallable(functionName);

            const result = await callable(data);
            this.incrementRequestCount();

            if (result.data && result.data.success) {
                return {
                    success: true,
                    response: result.data.response
                };
            } else {
                return {
                    success: false,
                    error: result.data.error || 'No response from cloud function'
                };
            }

        } catch (error) {
            console.error('Cloud function error:', error);
            return {
                success: false,
                error: error.message || 'Failed to call cloud function'
            };
        }
    },

    // Analyze daily reflection
    async analyzeDailyReflection(reflectionData) {
        if (!window.geminiConfig.features.journalInsights) {
            return null;
        }
        return await this.callCloudFunction('analyzeDailyReflection', reflectionData);
    },

    // Analyze SWOT
    async analyzeSWOT(swotData) {
        if (!window.geminiConfig.features.businessAnalysis) {
            return null;
        }
        return await this.callCloudFunction('analyzeSWOT', swotData);
    },

    // Analyze Ikigai
    async analyzeIkigai(ikigaiData) {
        if (!window.geminiConfig.features.businessAnalysis) {
            return null;
        }
        return await this.callCloudFunction('analyzeIkigai', ikigaiData);
    },

    // Analyze Value Proposition Canvas
    async analyzeValueProposition(valueData) {
        if (!window.geminiConfig.features.businessAnalysis) {
            return null;
        }
        return await this.callCloudFunction('analyzeValueProposition', valueData);
    },

    // Analyze 90-Day Action Plan
    async analyzeActionPlan(planData) {
        if (!window.geminiConfig.features.businessAnalysis) {
            return null;
        }
        return await this.callCloudFunction('analyzeActionPlan', planData);
    },

    // Detect patterns in multiple journal entries
    async detectPatterns(journalEntries) {
        if (!window.geminiConfig.features.patternDetection) {
            return null;
        }

        if (!Array.isArray(journalEntries) || journalEntries.length === 0) {
            return { success: false, error: 'No journal entries provided' };
        }

        return await this.callCloudFunction('detectPatterns', { entries: journalEntries });
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

        return await this.callCloudFunction('callGemini', { prompt });
    },

    // Get encouragement based on current state
    async getEncouragement(mood, progress) {
        if (!window.geminiConfig.features.encouragement) {
            return null;
        }

        const prompt = `Provide a short (2-3 sentences) encouraging message for someone on an entrepreneurial retreat who is feeling ${mood} and has made ${progress} progress. Be warm, supportive, and motivating.`;

        return await this.callCloudFunction('callGemini', { prompt });
    }
};

// Export for use in other modules
window.GeminiAI = GeminiCloud;
