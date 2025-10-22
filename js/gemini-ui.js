// Gemini AI UI Integration
// Adds AI insight buttons and displays to the app

// Initialize Gemini UI when app loads
function initializeGeminiUI() {
    if (!window.geminiConfig || !window.geminiConfig.enabled) {
        console.log('Gemini UI not initialized - Gemini disabled');
        return;
    }

    // Initialize Gemini
    const initialized = GeminiAI.init();
    if (!initialized) {
        console.warn('Gemini AI failed to initialize');
        return;
    }

    console.log('Initializing Gemini UI components...');

    // Add AI buttons to journal sections
    addJournalAIButtons();

    // Add AI buttons to business tools
    addBusinessToolsAIButtons();

    // Setup event listeners
    setupGeminiEventListeners();
}

// Add AI insight buttons to journal sections
function addJournalAIButtons() {
    // Daily Reflection
    const dailyExportBtn = document.getElementById('exportDailyPDF');
    if (dailyExportBtn) {
        const aiButton = createAIButton('Get AI Insights', 'analyzeDaily');
        const aiDisplay = createAIDisplay('dailyAIInsights');
        const buttonContainer = dailyExportBtn.parentElement;
        buttonContainer.insertBefore(aiButton, dailyExportBtn);
        buttonContainer.insertAdjacentElement('afterend', aiDisplay);
    }

    // Freeform Journal
    const freeformExportBtn = document.getElementById('exportFreeformPDF');
    if (freeformExportBtn) {
        const aiButton = createAIButton('Get AI Insights', 'analyzeFreeform');
        const aiDisplay = createAIDisplay('freeformAIInsights');
        const buttonContainer = freeformExportBtn.parentElement;
        buttonContainer.insertBefore(aiButton, freeformExportBtn);
        buttonContainer.insertAdjacentElement('afterend', aiDisplay);
    }

    // Future Letter
    const futureExportBtn = document.getElementById('exportFuturePDF');
    if (futureExportBtn) {
        const aiButton = createAIButton('Get AI Feedback', 'analyzeFuture');
        const aiDisplay = createAIDisplay('futureAIInsights');
        const buttonContainer = futureExportBtn.parentElement;
        buttonContainer.insertBefore(aiButton, futureExportBtn);
        buttonContainer.insertAdjacentElement('afterend', aiDisplay);
    }
}

// Add AI buttons to business tools
function addBusinessToolsAIButtons() {
    // SWOT Analysis
    const swotExportBtn = document.getElementById('exportSWOT');
    if (swotExportBtn) {
        const aiButton = createAIButton('Analyze with AI', 'analyzeSWOT');
        const aiDisplay = createAIDisplay('swotAIInsights');
        const buttonContainer = swotExportBtn.parentElement;
        buttonContainer.insertBefore(aiButton, swotExportBtn);
        buttonContainer.insertAdjacentElement('afterend', aiDisplay);
    }

    // Ikigai
    const ikigaiExportBtn = document.getElementById('exportIkigai');
    if (ikigaiExportBtn) {
        const aiButton = createAIButton('Get AI Insights', 'analyzeIkigai');
        const aiDisplay = createAIDisplay('ikigaiAIInsights');
        const buttonContainer = ikigaiExportBtn.parentElement;
        buttonContainer.insertBefore(aiButton, ikigaiExportBtn);
        buttonContainer.insertAdjacentElement('afterend', aiDisplay);
    }

    // Value Proposition
    const valueExportBtn = document.getElementById('exportValue');
    if (valueExportBtn) {
        const aiButton = createAIButton('Analyze with AI', 'analyzeValue');
        const aiDisplay = createAIDisplay('valueAIInsights');
        const buttonContainer = valueExportBtn.parentElement;
        buttonContainer.insertBefore(aiButton, valueExportBtn);
        buttonContainer.insertAdjacentElement('afterend', aiDisplay);
    }

    // 90-Day Action Plan
    const actionExportBtn = document.getElementById('exportAction');
    if (actionExportBtn) {
        const aiButton = createAIButton('Get AI Feedback', 'analyzeActionPlan');
        const aiDisplay = createAIDisplay('actionAIInsights');
        const buttonContainer = actionExportBtn.parentElement;
        buttonContainer.insertBefore(aiButton, actionExportBtn);
        buttonContainer.insertAdjacentElement('afterend', aiDisplay);
    }
}

// Create AI button element
function createAIButton(text, action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-primary ai-insight-btn';
    button.dataset.action = action;
    button.innerHTML = `<i class="bi bi-stars"></i> ${text}`;
    return button;
}

// Create AI display element
function createAIDisplay(id) {
    const div = document.createElement('div');
    div.id = id;
    div.className = 'ai-insights-display mb-3';
    div.style.display = 'none';
    return div;
}

// Setup event listeners for AI buttons
function setupGeminiEventListeners() {
    document.querySelectorAll('.ai-insight-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const action = this.dataset.action;
            await handleAIAction(action, this);
        });
    });
}

// Handle AI action
async function handleAIAction(action, button) {
    // Show loading state
    const originalHTML = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Analyzing...';

    let result;
    let displayId;

    try {
        switch (action) {
            case 'analyzeDaily':
                result = await analyzeDailyReflectionAI();
                displayId = 'dailyAIInsights';
                break;

            case 'analyzeFreeform':
                result = await analyzeFreeformAI();
                displayId = 'freeformAIInsights';
                break;

            case 'analyzeSWOT':
                result = await analyzeSWOTAI();
                displayId = 'swotAIInsights';
                break;

            case 'analyzeIkigai':
                result = await analyzeIkigaiAI();
                displayId = 'ikigaiAIInsights';
                break;

            case 'analyzeValue':
                result = await analyzeValuePropositionAI();
                displayId = 'valueAIInsights';
                break;

            case 'analyzeActionPlan':
                result = await analyzeActionPlanAI();
                displayId = 'actionAIInsights';
                break;

            default:
                result = { success: false, error: 'Unknown action' };
        }

        // Display result
        if (result && displayId) {
            displayAIInsights(displayId, result);
        }

    } catch (error) {
        console.error('AI analysis error:', error);
        alert('Error getting AI insights. Please try again.');
    } finally {
        // Restore button
        button.disabled = false;
        button.innerHTML = originalHTML;
    }
}

// Analyze daily reflection
async function analyzeDailyReflectionAI() {
    const data = {};
    document.querySelectorAll('#dailyReflectionForm .journal-field').forEach(field => {
        const fieldName = field.dataset.field;
        data[fieldName] = field.type === 'checkbox' ? field.checked : field.value;
    });

    data.date = document.getElementById('dailyDate')?.value;

    return await GeminiAI.analyzeDailyReflection(data);
}

// Analyze freeform journal
async function analyzeFreeformAI() {
    const data = {
        date: document.getElementById('freeformDate')?.value,
        text: document.getElementById('freeformText')?.value
    };

    // Use a simple prompt for freeform content
    const prompt = `You are a supportive wellness and business coach analyzing a journal entry from a retreat focused on entrepreneurship and personal growth.

Analyze this journal entry and provide:
1. Key themes and insights (2-3 sentences)
2. One actionable suggestion based on what was written
3. One encouraging message

Journal Entry (${data.date || 'No date'}):
${data.text || 'No content'}

Keep your response warm, supportive, and actionable. Focus on growth mindset and practical next steps.`;

    return await GeminiAI.callCloudFunction('callGemini', { prompt });
}

// Analyze SWOT
async function analyzeSWOTAI() {
    const data = {};
    document.querySelectorAll('[data-tool="swot"]').forEach(field => {
        data[field.dataset.field] = field.value;
    });

    return await GeminiAI.analyzeSWOT(data);
}

// Analyze Ikigai
async function analyzeIkigaiAI() {
    const data = {};
    document.querySelectorAll('[data-tool="ikigai"]').forEach(field => {
        data[field.dataset.field] = field.value;
    });

    return await GeminiAI.analyzeIkigai(data);
}

// Analyze Value Proposition
async function analyzeValuePropositionAI() {
    const data = {};
    document.querySelectorAll('[data-tool="value"]').forEach(field => {
        data[field.dataset.field] = field.value;
    });

    return await GeminiAI.analyzeValueProposition(data);
}

// Analyze Action Plan
async function analyzeActionPlanAI() {
    const data = {};
    document.querySelectorAll('[data-tool="action"]').forEach(field => {
        data[field.dataset.field] = field.value;
    });

    return await GeminiAI.analyzeActionPlan(data);
}

// Display AI insights
function displayAIInsights(displayId, result) {
    const display = document.getElementById(displayId);
    if (!display) return;

    if (result.success) {
        display.innerHTML = `
            <div class="alert alert-info ai-insight-box">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="mb-0">
                        <i class="bi bi-stars text-primary"></i>
                        AI Insights
                    </h6>
                    <button type="button" class="btn-close btn-sm" onclick="this.closest('.ai-insights-display').style.display='none'"></button>
                </div>
                <div class="ai-insight-content">
                    ${formatAIResponse(result.response)}
                </div>
            </div>
        `;
        display.style.display = 'block';

        // Scroll to insights
        display.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } else {
        display.innerHTML = `
            <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle"></i>
                ${result.error || 'Unable to generate insights. Please try again.'}
            </div>
        `;
        display.style.display = 'block';
    }
}

// Format AI response (convert markdown-like formatting to HTML)
function formatAIResponse(text) {
    if (!text) return '';

    // Convert markdown-style formatting
    let formatted = text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.+?)\*/g, '<em>$1</em>') // Italic
        .replace(/\n\n/g, '</p><p>') // Paragraphs
        .replace(/\n/g, '<br>') // Line breaks
        .replace(/^(\d+\.)/gm, '<br><strong>$1</strong>'); // Numbered lists

    return `<p>${formatted}</p>`;
}

// Add pattern detection button to journal view page
function addPatternDetectionButton() {
    const journalsList = document.getElementById('journalsList');
    if (!journalsList) return;

    const existingBtn = document.getElementById('detectPatternsBtn');
    if (existingBtn) return; // Already added

    const container = journalsList.closest('.card-body');
    if (!container) return;

    const btnDiv = container.querySelector('.d-flex');
    if (btnDiv) {
        const patternBtn = document.createElement('button');
        patternBtn.id = 'detectPatternsBtn';
        patternBtn.className = 'btn btn-outline-primary ms-2';
        patternBtn.innerHTML = '<i class="bi bi-graph-up"></i> Detect Patterns';
        patternBtn.onclick = detectJournalPatterns;
        btnDiv.appendChild(patternBtn);
    }
}

// Detect patterns in journal entries
async function detectJournalPatterns() {
    const button = document.getElementById('detectPatternsBtn');
    if (!button) return;

    // Get all daily reflections for current user
    const journals = Storage.getUserJournals(currentUser);
    const dailyEntries = Object.entries(journals.daily || {}).map(([date, entry]) => ({
        date,
        ...entry
    }));

    if (dailyEntries.length < 2) {
        alert('Need at least 2 journal entries to detect patterns.');
        return;
    }

    // Show loading
    const originalHTML = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Analyzing...';

    try {
        const result = await GeminiAI.detectPatterns(dailyEntries);

        // Display in journals list
        const journalsList = document.getElementById('journalsList');
        if (journalsList && result.success) {
            const insightsDiv = document.createElement('div');
            insightsDiv.className = 'alert alert-info ai-insight-box mb-4';
            insightsDiv.innerHTML = `
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="mb-0">
                        <i class="bi bi-graph-up text-primary"></i>
                        Pattern Analysis (${dailyEntries.length} entries)
                    </h6>
                    <button type="button" class="btn-close btn-sm" onclick="this.remove()"></button>
                </div>
                <div class="ai-insight-content">
                    ${formatAIResponse(result.response)}
                </div>
            `;
            journalsList.prepend(insightsDiv);
        } else if (result.error) {
            alert(`Error: ${result.error}`);
        }

    } catch (error) {
        console.error('Pattern detection error:', error);
        alert('Error detecting patterns. Please try again.');
    } finally {
        button.disabled = false;
        button.innerHTML = originalHTML;
    }
}

// Initialize Gemini UI when called
window.initializeGeminiUI = initializeGeminiUI;
window.addPatternDetectionButton = addPatternDetectionButton;
window.detectJournalPatterns = detectJournalPatterns;
