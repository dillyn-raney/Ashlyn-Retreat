// Main Application Logic for Ashlyn Retreat

// Global state
let retreatData = null;
let currentUser = 'Dillyn';
let autoSavers = {};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // FIREBASE INITIALIZATION FIRST
        if (window.firebaseFeatures && window.firebaseFeatures.enabled) {
            console.log('Firebase enabled, initializing...');
            const firebaseInitialized = await FirebaseSync.init();

            if (firebaseInitialized) {
                console.log('Firebase initialized, waiting for authentication...');
                // Setup Firebase UI handlers
                if (typeof setupFirebaseUI === 'function') {
                    setupFirebaseUI();
                }
                // Don't initialize app yet - wait for auth state change
                return;
            } else {
                console.log('Firebase failed to initialize, continuing in offline mode');
            }
        } else {
            console.log('Firebase disabled, running in offline mode');
            const authModal = document.getElementById('authModal');
            if (authModal) authModal.style.display = 'none';
        }

        // Initialize app immediately (Firebase disabled or failed)
        await initializeApp();

    } catch (error) {
        console.error('Error during initialization:', error);
        alert('Error loading application. Please refresh the page.');
    }
});

// Main app initialization function
async function initializeApp() {
    console.log('Initializing app...');
    
    try {
        await loadRetreatData();

        // Initialize user
        currentUser = Storage.getCurrentUser();
        updateUserDisplay();

        // Setup event listeners
        setupEventListeners();

        // Render all sections
        renderSchedule();
        renderMeals();
        renderSupplies();
        renderPrompts();
        loadJournalData();
        loadToolsData();

        // Setup countdown timer
        updateCountdownTimer();
        setInterval(updateCountdownTimer, 60000);

        // Update progress
        updateSuppliesProgress();

        // Setup smooth scrolling
        setupSmoothScrolling();

        console.log('App initialized successfully');

        // Initialize Gemini AI UI
        if (typeof initializeGeminiUI === 'function') {
            initializeGeminiUI();
        }
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('Error loading retreat data. Please refresh the page.');
    }
}

// Make initializeApp global so Firebase can call it
window.initializeApp = initializeApp;

// Load retreat data from JSON
async function loadRetreatData() {
    try {
        const response = await fetch('data/retreat-data.json');
        if (!response.ok) throw new Error('Failed to load data');
        retreatData = await response.json();
    } catch (error) {
        console.error('Error loading retreat data:', error);
        throw error;
    }
}

// Setup all event listeners
function setupEventListeners() {
    // User toggle
    document.getElementById('userToggle')?.addEventListener('click', toggleUser);

    // Notifications
    document.getElementById('enableNotifications')?.addEventListener('click', enableNotifications);
    document.getElementById('exportAllCalendar')?.addEventListener('click', exportAllCalendar);

    // Journal auto-save setup
    setupJournalAutoSave();

    // Tool auto-save setup
    setupToolAutoSave();

    // Kanban
    document.getElementById('addKanbanCard')?.addEventListener('click', showKanbanModal);
    document.getElementById('saveKanbanCard')?.addEventListener('click', saveKanbanCard);

    // Export buttons
    document.getElementById('exportDailyPDF')?.addEventListener('click', () => exportJournalPDF('daily'));
    document.getElementById('exportFuturePDF')?.addEventListener('click', () => exportJournalPDF('future'));
    document.getElementById('exportAllJournals')?.addEventListener('click', exportAllJournalsPDF);
    document.getElementById('exportIkigai')?.addEventListener('click', () => exportToolPDF('ikigai'));
    document.getElementById('exportSWOT')?.addEventListener('click', () => exportToolPDF('swot'));
    document.getElementById('exportValue')?.addEventListener('click', () => exportToolPDF('value'));
    document.getElementById('exportAction')?.addEventListener('click', () => exportToolPDF('action'));

    // Freeform journal
    document.getElementById('saveFreeform')?.addEventListener('click', saveFreeformEntry);
    document.getElementById('promptSelector')?.addEventListener('change', handlePromptSelection);

    // Supplies
    document.getElementById('resetSupplies')?.addEventListener('click', resetSupplies);

    // Daily journal date change
    document.getElementById('dailyDate')?.addEventListener('change', loadDailyReflection);

    // Energy level slider
    document.getElementById('energyLevel')?.addEventListener('input', (e) => {
        document.getElementById('energyValue').textContent = e.target.value;
    });
}

// User Management
function toggleUser() {
    currentUser = currentUser === 'Dillyn' ? 'Ashlee' : 'Dillyn';
    Storage.setCurrentUser(currentUser);
    updateUserDisplay();
    loadJournalData();
    loadToolsData();
}

function updateUserDisplay() {
    const userSpan = document.getElementById('currentUser');
    if (userSpan) {
        userSpan.textContent = currentUser;
    }
}

// Countdown Timer
function updateCountdownTimer() {
    const timerDiv = document.getElementById('countdownTimer');
    if (!timerDiv) return;

    const retreatStart = new Date('2025-10-23T15:00:00');
    const now = new Date();
    const diff = retreatStart - now;

    if (diff < 0) {
        // Retreat has started or passed
        const retreatEnd = new Date('2025-10-26T11:00:00');
        if (now < retreatEnd) {
            timerDiv.innerHTML = '<h4><i class="bi bi-heart-fill text-danger"></i> The Retreat is Happening Now!</h4>';
        } else {
            timerDiv.innerHTML = '<h4><i class="bi bi-check-circle text-success"></i> Retreat Completed</h4>';
        }
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    timerDiv.innerHTML = `
        <h4>Countdown to Retreat</h4>
        <div class="d-flex justify-content-center gap-3 mt-3">
            <div><strong>${days}</strong><br><small>Days</small></div>
            <div><strong>${hours}</strong><br><small>Hours</small></div>
            <div><strong>${minutes}</strong><br><small>Minutes</small></div>
        </div>
    `;
}

// Schedule Rendering
function renderSchedule() {
    const accordion = document.getElementById('scheduleAccordion');
    if (!accordion || !retreatData) return;

    accordion.innerHTML = '';

    Object.entries(retreatData.schedule).forEach(([date, dayData], index) => {
        const accordionItem = createScheduleDay(date, dayData, index);
        accordion.appendChild(accordionItem);
    });

    // Highlight current activity
    highlightCurrentActivity();
    setInterval(highlightCurrentActivity, 60000);
}

function createScheduleDay(date, dayData, index) {
    const div = document.createElement('div');
    div.className = 'accordion-item';

    const headerId = `heading-${date}`;
    const collapseId = `collapse-${date}`;

    // Parse date as local time to avoid timezone issues
    const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    div.innerHTML = `
        <h2 class="accordion-header" id="${headerId}">
            <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button"
                    data-bs-toggle="collapse" data-bs-target="#${collapseId}">
                <div class="w-100">
                    <div class="schedule-day-title">${dayData.day} - ${dayData.title}</div>
                    <div class="schedule-day-date">${formattedDate}</div>
                </div>
            </button>
        </h2>
        <div id="${collapseId}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}"
             data-bs-parent="#scheduleAccordion">
            <div class="accordion-body">
                <button class="btn btn-sm btn-outline-secondary mb-3" onclick="Calendar.exportDay('${date}', ${JSON.stringify(dayData.activities).replace(/"/g, '&quot;')})">
                    <i class="bi bi-calendar-plus"></i> Add Day to Calendar
                </button>
                <div id="activities-${date}">
                    ${dayData.activities.map((activity, idx) => createActivityCard(date, activity, idx)).join('')}
                </div>
            </div>
        </div>
    `;

    return div;
}

function createActivityCard(date, activity, index) {
    const energyClass = `energy-${activity.energy}`;

    return `
        <div class="activity-card" data-date="${date}" data-time="${activity.time}" data-index="${index}">
            <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <div class="activity-time">
                        <i class="bi bi-clock"></i> ${activity.time}
                        <span class="energy-badge ${energyClass}">
                            ${activity.energy === 'energizing' ? '🟢' : activity.energy === 'moderate' ? '🟡' : '🔵'}
                            ${activity.energy}
                        </span>
                    </div>
                    <h5 class="activity-title">${activity.title}</h5>
                    <p class="activity-description">${activity.description}</p>
                    <small class="text-muted">Duration: ${activity.duration} min</small>
                </div>
                <button class="btn btn-sm btn-outline-primary"
                        onclick='Calendar.exportActivity("${date}", ${JSON.stringify(activity).replace(/'/g, "\\'")})'
                        title="Add to calendar">
                    <i class="bi bi-calendar-plus"></i>
                </button>
            </div>
        </div>
    `;
}

function highlightCurrentActivity() {
    if (!retreatData) return;

    // Remove existing highlights
    document.querySelectorAll('.current-activity').forEach(el => {
        el.classList.remove('current-activity');
    });

    const currentActivity = Notifications.getCurrentActivity(retreatData.schedule);
    if (currentActivity) {
        const now = new Date();
        const todayKey = now.toISOString().split('T')[0];
        const card = document.querySelector(
            `.activity-card[data-date="${todayKey}"][data-time="${currentActivity.time}"]`
        );
        if (card) {
            card.classList.add('current-activity');
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

// Notifications
async function enableNotifications() {
    const enabled = await Notifications.requestPermission();
    if (enabled && retreatData) {
        Notifications.startChecking(retreatData.schedule);
    }
}

function exportAllCalendar() {
    if (retreatData) {
        Calendar.exportAllSchedule(retreatData.schedule);
    }
}

// Journal Auto-Save
function setupJournalAutoSave() {
    // Daily reflection auto-save
    const dailyFields = document.querySelectorAll('#dailyReflectionForm .journal-field');
    autoSavers.daily = new AutoSaver(saveDailyReflection, 30000);

    dailyFields.forEach(field => {
        field.addEventListener('input', () => autoSavers.daily.trigger());
        field.addEventListener('blur', () => autoSavers.daily.saveNow());
    });

    // Future letter auto-save
    const futureFields = document.querySelectorAll('#futureLetterForm .journal-field');
    autoSavers.future = new AutoSaver(saveFutureLetter, 30000);

    futureFields.forEach(field => {
        field.addEventListener('input', () => autoSavers.future.trigger());
        field.addEventListener('blur', () => autoSavers.future.saveNow());
    });

    // Freeform auto-save
    const freeformField = document.getElementById('freeformText');
    if (freeformField) {
        autoSavers.freeform = new AutoSaver(() => {
            // Auto-save happens on explicit save button
        }, 30000);
        freeformField.addEventListener('input', () => {
            showSaveIndicator('freeformSaveIndicator', 'typing');
        });
    }
}

function showSaveIndicator(indicatorId, state) {
    const indicator = document.getElementById(indicatorId);
    if (!indicator) return;

    if (state === 'saving') {
        indicator.innerHTML = '<i class="bi bi-arrow-repeat"></i> Saving...';
        indicator.className = 'save-indicator saving';
    } else if (state === 'saved') {
        indicator.innerHTML = '<i class="bi bi-check-circle"></i> Saved';
        indicator.className = 'save-indicator saved';
        setTimeout(() => {
            indicator.innerHTML = '';
            indicator.className = 'save-indicator';
        }, 3000);
    } else if (state === 'typing') {
        indicator.innerHTML = '<i class="bi bi-pencil"></i> Typing...';
        indicator.className = 'save-indicator';
    }
}

function saveDailyReflection() {
    const date = document.getElementById('dailyDate')?.value;
    if (!date) return;

    showSaveIndicator('dailySaveIndicator', 'saving');

    const data = {};
    document.querySelectorAll('#dailyReflectionForm .journal-field').forEach(field => {
        const fieldName = field.dataset.field;
        if (field.type === 'checkbox') {
            data[fieldName] = field.checked;
        } else {
            data[fieldName] = field.value;
        }
    });

    Storage.saveDailyReflection(date, data, currentUser);
    showSaveIndicator('dailySaveIndicator', 'saved');
}

function loadDailyReflection() {
    const date = document.getElementById('dailyDate')?.value;
    if (!date) return;

    const data = Storage.getDailyReflection(date, currentUser);
    if (!data) return;

    document.querySelectorAll('#dailyReflectionForm .journal-field').forEach(field => {
        const fieldName = field.dataset.field;
        if (data[fieldName] !== undefined) {
            if (field.type === 'checkbox') {
                field.checked = data[fieldName];
            } else {
                field.value = data[fieldName];
            }
        }
    });

    // Update energy slider display
    const energyValue = document.getElementById('energyValue');
    const energyLevel = document.getElementById('energyLevel');
    if (energyValue && energyLevel) {
        energyValue.textContent = energyLevel.value;
    }
}

function saveFutureLetter() {
    showSaveIndicator('futureSaveIndicator', 'saving');

    const data = {};
    document.querySelectorAll('#futureLetterForm .journal-field').forEach(field => {
        data[field.dataset.field] = field.value;
    });

    Storage.saveFutureLetter(data, currentUser);
    showSaveIndicator('futureSaveIndicator', 'saved');
}

function loadFutureLetter() {
    const data = Storage.getFutureLetter(currentUser);
    if (!data) return;

    document.querySelectorAll('#futureLetterForm .journal-field').forEach(field => {
        const fieldName = field.dataset.field;
        if (data[fieldName]) {
            field.value = data[fieldName];
        }
    });
}

function saveFreeformEntry() {
    const date = document.getElementById('freeformDate')?.value;
    const text = document.getElementById('freeformText')?.value;

    if (!date || !text) {
        alert('Please enter a date and your thoughts.');
        return;
    }

    const entry = {
        date: date,
        text: text,
        type: 'freeform'
    };

    Storage.saveFreeformEntry(entry, currentUser);
    showSaveIndicator('freeformSaveIndicator', 'saved');

    // Clear form
    document.getElementById('freeformText').value = '';
    document.getElementById('promptSelector').value = '';

    alert('Journal entry saved!');
}

function loadJournalData() {
    // Set today's date for daily reflection (using local timezone)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    const dailyDate = document.getElementById('dailyDate');
    if (dailyDate && !dailyDate.value) {
        dailyDate.value = today;
    }

    // Set today's date for freeform
    const freeformDate = document.getElementById('freeformDate');
    if (freeformDate && !freeformDate.value) {
        freeformDate.value = today;
    }

    // Load daily reflection
    loadDailyReflection();

    // Load future letter
    loadFutureLetter();

    // Load journal list
    renderJournalsList();
}

function renderJournalsList() {
    const container = document.getElementById('journalsList');
    if (!container) return;

    const dailyEntries = Storage.getUserJournals(currentUser).daily || {};
    const freeformEntries = Storage.getFreeformEntries(currentUser) || [];
    const futureLetter = Storage.getFutureLetter(currentUser);

    let html = '';

    // Daily reflections
    const dailyDates = Object.keys(dailyEntries).sort().reverse();
    if (dailyDates.length > 0) {
        html += '<h6 class="mt-3">Daily Reflections</h6>';
        dailyDates.forEach(date => {
            const entry = dailyEntries[date];
            // Parse date as local time by appending 'T00:00:00' to treat as local midnight
            const displayDate = new Date(date + 'T00:00:00').toLocaleDateString();
            html += `
                <div class="journal-entry">
                    <div class="journal-entry-header">
                        <span class="journal-entry-date">${displayDate}</span>
                        <span class="journal-entry-type">Daily</span>
                    </div>
                    <div class="journal-entry-content">
                        <p><strong>Intention:</strong> ${entry.intention || 'N/A'}</p>
                        <p><strong>Key Insights:</strong> ${entry.insights || 'N/A'}</p>
                    </div>
                </div>
            `;
        });
    }

    // Freeform entries
    if (freeformEntries.length > 0) {
        html += '<h6 class="mt-3">Freeform Entries</h6>';
        freeformEntries.forEach(entry => {
            // Parse date as local time by appending 'T00:00:00' to treat as local midnight
            const displayDate = new Date(entry.date + 'T00:00:00').toLocaleDateString();
            html += `
                <div class="journal-entry">
                    <div class="journal-entry-header">
                        <span class="journal-entry-date">${displayDate}</span>
                        <span class="journal-entry-type">Freeform</span>
                    </div>
                    <div class="journal-entry-content">
                        <p>${entry.text.substring(0, 200)}${entry.text.length > 200 ? '...' : ''}</p>
                    </div>
                </div>
            `;
        });
    }

    // Future letter
    if (futureLetter && Object.keys(futureLetter).length > 1) {
        html += '<h6 class="mt-3">Letter to Future Self</h6>';
        html += `
            <div class="journal-entry">
                <div class="journal-entry-header">
                    <span class="journal-entry-date">To be opened April 23, 2026</span>
                    <span class="journal-entry-type">Future</span>
                </div>
                <div class="journal-entry-content">
                    <p><strong>Business Idea:</strong> ${futureLetter.businessIdea || 'N/A'}</p>
                </div>
            </div>
        `;
    }

    if (html === '') {
        html = '<p class="text-muted">No journal entries yet. Start writing!</p>';
    }

    container.innerHTML = html;

    // Add pattern detection button if Gemini enabled
    if (typeof addPatternDetectionButton === 'function') {
        addPatternDetectionButton();
    }
}

// Prompts
function renderPrompts() {
    const selector = document.getElementById('promptSelector');
    if (!selector || !retreatData) return;

    const allPrompts = [
        ...retreatData.prompts.general.map(p => ({ text: p, type: 'General' })),
        ...retreatData.prompts.couples.map(p => ({ text: p, type: 'Couples' }))
    ];

    allPrompts.forEach((prompt, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `[${prompt.type}] ${prompt.text}`;
        option.dataset.promptText = prompt.text;
        selector.appendChild(option);
    });
}

function handlePromptSelection(e) {
    const selectedOption = e.target.options[e.target.selectedIndex];
    if (selectedOption && selectedOption.dataset.promptText) {
        const textarea = document.getElementById('freeformText');
        if (textarea) {
            textarea.value = `Prompt: ${selectedOption.dataset.promptText}\n\n`;
            textarea.focus();
        }
    }
}

// Tools Auto-Save
function setupToolAutoSave() {
    // Ikigai
    const ikigaiFields = document.querySelectorAll('[data-tool="ikigai"]');
    autoSavers.ikigai = new AutoSaver(saveIkigai, 30000);
    ikigaiFields.forEach(field => {
        field.addEventListener('input', () => autoSavers.ikigai.trigger());
        field.addEventListener('blur', () => autoSavers.ikigai.saveNow());
    });

    // SWOT
    const swotFields = document.querySelectorAll('[data-tool="swot"]');
    autoSavers.swot = new AutoSaver(saveSWOT, 30000);
    swotFields.forEach(field => {
        field.addEventListener('input', () => autoSavers.swot.trigger());
        field.addEventListener('blur', () => autoSavers.swot.saveNow());
    });

    // Value Prop
    const valueFields = document.querySelectorAll('[data-tool="value"]');
    autoSavers.value = new AutoSaver(saveValue, 30000);
    valueFields.forEach(field => {
        field.addEventListener('input', () => autoSavers.value.trigger());
        field.addEventListener('blur', () => autoSavers.value.saveNow());
    });

    // Action Plan
    const actionFields = document.querySelectorAll('[data-tool="action"]');
    autoSavers.action = new AutoSaver(saveActionPlan, 30000);
    actionFields.forEach(field => {
        field.addEventListener('input', () => autoSavers.action.trigger());
        field.addEventListener('blur', () => autoSavers.action.saveNow());
    });
}

function saveIkigai() {
    showSaveIndicator('ikigaiSaveIndicator', 'saving');
    const data = {};
    document.querySelectorAll('[data-tool="ikigai"]').forEach(field => {
        data[field.dataset.field] = field.value;
    });
    Storage.saveToolData('ikigai', data);
    updateIkigaiDiagram(data);
    showSaveIndicator('ikigaiSaveIndicator', 'saved');
}

function updateIkigaiDiagram(data) {
    const svg = document.querySelector('#ikigaiDiagram svg');
    if (!svg) return;

    // Remove existing dynamic text elements
    svg.querySelectorAll('.ikigai-content-text').forEach(el => el.remove());

    // Helper to wrap text
    function wrapText(text, maxLength) {
        if (!text) return [];
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        words.forEach(word => {
            if ((currentLine + word).length > maxLength) {
                if (currentLine) lines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine += word + ' ';
            }
        });
        if (currentLine) lines.push(currentLine.trim());
        return lines.slice(0, 3); // Max 3 lines
    }

    // Add text to each circle
    const positions = {
        love: { x: 150, y: 140, color: '#4A5D5A' },
        goodAt: { x: 250, y: 140, color: '#4A5D5A' },
        worldNeeds: { x: 150, y: 260, color: '#4A5D5A' },
        paidFor: { x: 250, y: 260, color: '#4A5D5A' }
    };

    Object.entries(positions).forEach(([field, pos]) => {
        const text = data[field] || '';
        const lines = wrapText(text, 15);

        lines.forEach((line, i) => {
            const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textEl.setAttribute('x', pos.x);
            textEl.setAttribute('y', pos.y + (i * 12));
            textEl.setAttribute('text-anchor', 'middle');
            textEl.setAttribute('class', 'ikigai-content-text');
            textEl.setAttribute('fill', pos.color);
            textEl.setAttribute('font-size', '10');
            textEl.textContent = line;
            svg.appendChild(textEl);
        });
    });
}

function saveSWOT() {
    showSaveIndicator('swotSaveIndicator', 'saving');
    const data = {};
    document.querySelectorAll('[data-tool="swot"]').forEach(field => {
        data[field.dataset.field] = field.value;
    });
    Storage.saveToolData('swot_analyses', data);
    showSaveIndicator('swotSaveIndicator', 'saved');
}

function saveValue() {
    showSaveIndicator('valueSaveIndicator', 'saving');
    const data = {};
    document.querySelectorAll('[data-tool="value"]').forEach(field => {
        data[field.dataset.field] = field.value;
    });
    Storage.saveToolData('value_prop', data);
    showSaveIndicator('valueSaveIndicator', 'saved');
}

function saveActionPlan() {
    showSaveIndicator('actionSaveIndicator', 'saving');
    const data = {};
    document.querySelectorAll('[data-tool="action"]').forEach(field => {
        data[field.dataset.field] = field.value;
    });
    Storage.saveToolData('action_plan', data);
    showSaveIndicator('actionSaveIndicator', 'saved');
}

function loadToolsData() {
    // Load Ikigai
    const ikigaiData = Storage.getToolData('ikigai');
    Object.entries(ikigaiData).forEach(([field, value]) => {
        const fieldEl = document.querySelector(`[data-tool="ikigai"][data-field="${field}"]`);
        if (fieldEl && value) fieldEl.value = value;
    });
    updateIkigaiDiagram(ikigaiData);

    // Load SWOT
    const swotData = Storage.getToolData('swot_analyses');
    Object.entries(swotData).forEach(([field, value]) => {
        const fieldEl = document.querySelector(`[data-tool="swot"][data-field="${field}"]`);
        if (fieldEl && value) fieldEl.value = value;
    });

    // Load Value Prop
    const valueData = Storage.getToolData('value_prop');
    Object.entries(valueData).forEach(([field, value]) => {
        const fieldEl = document.querySelector(`[data-tool="value"][data-field="${field}"]`);
        if (fieldEl && value) fieldEl.value = value;
    });

    // Load Action Plan
    const actionData = Storage.getToolData('action_plan');
    Object.entries(actionData).forEach(([field, value]) => {
        const fieldEl = document.querySelector(`[data-tool="action"][data-field="${field}"]`);
        if (fieldEl && value) fieldEl.value = value;
    });

    // Load Kanban
    renderKanban();
}

// Kanban Board
function renderKanban() {
    const kanban = Storage.getKanban();

    ['develop', 'ready', 'parking'].forEach(column => {
        const container = document.getElementById(`kanban${column.charAt(0).toUpperCase() + column.slice(1)}`);
        if (!container) return;

        container.innerHTML = '';

        kanban[column].forEach(card => {
            const cardEl = createKanbanCardElement(card, column);
            container.appendChild(cardEl);
        });
    });
}

function createKanbanCardElement(card, column) {
    const div = document.createElement('div');
    div.className = 'kanban-card';
    div.dataset.cardId = card.id;

    const moveButtons = [];
    if (column !== 'develop') {
        moveButtons.push(`<button class="btn btn-sm btn-outline-secondary" onclick="moveKanbanCard(${card.id}, '${column}', 'develop')" title="Move to Develop Further"><i class="bi bi-arrow-left"></i></button>`);
    }
    if (column !== 'ready') {
        moveButtons.push(`<button class="btn btn-sm btn-outline-warning" onclick="moveKanbanCard(${card.id}, '${column}', 'ready')" title="Move to Ready"><i class="bi bi-star"></i></button>`);
    }
    if (column !== 'parking') {
        moveButtons.push(`<button class="btn btn-sm btn-outline-secondary" onclick="moveKanbanCard(${card.id}, '${column}', 'parking')" title="Move to Parking Lot"><i class="bi bi-arrow-right"></i></button>`);
    }

    div.innerHTML = `
        <div class="kanban-card-title">${card.title}</div>
        <div class="kanban-card-desc">${card.description || ''}</div>
        <div class="kanban-card-actions">
            ${moveButtons.join('')}
            <button class="btn btn-sm btn-outline-danger" onclick="deleteKanbanCard(${card.id}, '${column}')" title="Delete">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;

    return div;
}

function showKanbanModal() {
    const modal = new bootstrap.Modal(document.getElementById('kanbanModal'));
    document.getElementById('kanbanCardTitle').value = '';
    document.getElementById('kanbanCardDesc').value = '';
    document.getElementById('kanbanCardColumn').value = 'develop';
    modal.show();
}

function saveKanbanCard() {
    const title = document.getElementById('kanbanCardTitle')?.value;
    const description = document.getElementById('kanbanCardDesc')?.value;
    const column = document.getElementById('kanbanCardColumn')?.value;

    if (!title) {
        alert('Please enter a title for the idea.');
        return;
    }

    // Check if adding to "ready" and it already has a card
    const kanban = Storage.getKanban();
    if (column === 'ready' && kanban.ready.length > 0) {
        alert('Only ONE card can be in "Ready for Action" at a time. Please choose a different column or move the existing card first.');
        return;
    }

    const card = {
        title: title,
        description: description,
        column: column
    };

    Storage.addKanbanCard(card);
    renderKanban();

    const modal = bootstrap.Modal.getInstance(document.getElementById('kanbanModal'));
    modal.hide();
}

function moveKanbanCard(cardId, fromColumn, toColumn) {
    const success = Storage.moveKanbanCard(cardId, fromColumn, toColumn);
    if (success) {
        renderKanban();
    }
}

function deleteKanbanCard(cardId, column) {
    if (confirm('Are you sure you want to delete this idea?')) {
        Storage.deleteKanbanCard(cardId, column);
        renderKanban();
    }
}

// Make functions global for onclick handlers
window.moveKanbanCard = moveKanbanCard;
window.deleteKanbanCard = deleteKanbanCard;

// Meals
function renderMeals() {
    if (!retreatData) return;

    renderRecipes();
    renderSnacks();
}

function renderRecipes() {
    const container = document.getElementById('recipesList');
    if (!container || !retreatData) return;

    container.innerHTML = retreatData.recipes.map(recipe => `
        <div class="col-md-12 mb-4">
            <div class="recipe-card">
                <div class="recipe-header">
                    <h4 class="recipe-title">${recipe.name}</h4>
                    <div>
                        <span class="recipe-time"><i class="bi bi-clock"></i> Prep: ${recipe.prepTime}</span>
                        <span class="recipe-time"><i class="bi bi-fire"></i> Cook: ${recipe.cookTime}</span>
                        <span class="badge bg-primary">${recipe.day}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="recipe-ingredients">
                            <h6><i class="bi bi-list-check"></i> Ingredients</h6>
                            <ul>
                                ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="recipe-instructions">
                            <h6><i class="bi bi-list-ol"></i> Instructions</h6>
                            <ol>
                                ${recipe.instructions.map(inst => `<li>${inst}</li>`).join('')}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderSnacks() {
    const container = document.getElementById('snacksList');
    if (!container || !retreatData) return;

    container.innerHTML = retreatData.snacks.map(snack => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="snack-card">
                <div class="snack-name">
                    <i class="bi bi-heart-fill text-success"></i> ${snack.name}
                </div>
                <div class="snack-benefits">
                    ${snack.benefits}
                </div>
            </div>
        </div>
    `).join('');
}

// Supplies
function renderSupplies() {
    const container = document.getElementById('suppliesList');
    if (!container || !retreatData) return;

    const suppliesData = Storage.getSupplies();
    const savedSupplies = suppliesData.checked || {};
    const customSupplies = suppliesData.custom || [];

    // Group custom supplies by category
    const customByCategory = {};
    customSupplies.forEach(supply => {
        if (!customByCategory[supply.category]) {
            customByCategory[supply.category] = [];
        }
        customByCategory[supply.category].push(supply);
    });

    // Get all unique categories (default + custom)
    const allCategories = [...new Set([
        ...retreatData.supplies.map(c => c.category),
        ...Object.keys(customByCategory)
    ])];

    container.innerHTML = allCategories.map(categoryName => {
        const defaultCategory = retreatData.supplies.find(c => c.category === categoryName);
        const customItems = customByCategory[categoryName] || [];

        let html = `<div class="supply-category">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h5 class="supply-category-title mb-0">${categoryName}</h5>
                <button class="btn btn-sm btn-outline-primary" onclick="showAddSupplyModal('${categoryName}')">
                    <i class="bi bi-plus-lg"></i> Add Item
                </button>
            </div>`;

        // Render default items
        if (defaultCategory) {
            html += defaultCategory.items.map((item, itemIndex) => {
                const catIndex = retreatData.supplies.indexOf(defaultCategory);
                const key = `${catIndex}_${itemIndex}`;
                const checked = savedSupplies[key] || false;
                return `
                    <div class="supply-item ${checked ? 'checked' : ''}" onclick="toggleSupply(${catIndex}, ${itemIndex})">
                        <input type="checkbox" ${checked ? 'checked' : ''} onclick="event.stopPropagation(); toggleSupply(${catIndex}, ${itemIndex})">
                        <label>${item}</label>
                    </div>
                `;
            }).join('');
        }

        // Render custom items
        html += customItems.map(supply => {
            const key = `custom_${supply.id}`;
            const checked = savedSupplies[key] || false;
            return `
                <div class="supply-item ${checked ? 'checked' : ''}" onclick="toggleCustomSupply(${supply.id})">
                    <input type="checkbox" ${checked ? 'checked' : ''} onclick="event.stopPropagation(); toggleCustomSupply(${supply.id})">
                    <label>${supply.item}</label>
                    <div class="supply-item-actions">
                        <button class="btn btn-sm btn-link text-primary" onclick="event.stopPropagation(); editSupply(${supply.id}, '${supply.category.replace(/'/g, "\\'")}', '${supply.item.replace(/'/g, "\\'")}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-link text-danger" onclick="event.stopPropagation(); deleteSupply(${supply.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        html += '</div>';
        return html;
    }).join('');

    updateSuppliesProgress();
}

function toggleSupply(category, itemIndex) {
    Storage.toggleSupply(category, itemIndex);
    renderSupplies();
}

function toggleCustomSupply(id) {
    const supplies = Storage.getSupplies();
    if (!supplies.checked) supplies.checked = {};
    const key = `custom_${id}`;
    supplies.checked[key] = !supplies.checked[key];
    Storage.saveSupplies(supplies);
    renderSupplies();
}

function showAddSupplyModal(category) {
    const modal = document.getElementById('supplyModal');
    const modalTitle = document.getElementById('supplyModalTitle');
    const categoryInput = document.getElementById('supplyCategory');
    const itemInput = document.getElementById('supplyItem');
    const saveBtn = document.getElementById('saveSupplyBtn');

    modalTitle.textContent = 'Add Supply Item';
    categoryInput.value = category;
    itemInput.value = '';

    // Remove old event listener and add new one
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

    newSaveBtn.addEventListener('click', () => {
        const cat = categoryInput.value.trim();
        const item = itemInput.value.trim();

        if (!cat || !item) {
            alert('Please enter both category and item name');
            return;
        }

        Storage.addCustomSupply(cat, item);
        renderSupplies();
        bootstrap.Modal.getInstance(modal).hide();
    });

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

function editSupply(id, category, item) {
    const modal = document.getElementById('supplyModal');
    const modalTitle = document.getElementById('supplyModalTitle');
    const categoryInput = document.getElementById('supplyCategory');
    const itemInput = document.getElementById('supplyItem');
    const saveBtn = document.getElementById('saveSupplyBtn');

    modalTitle.textContent = 'Edit Supply Item';
    categoryInput.value = category;
    itemInput.value = item;

    // Remove old event listener and add new one
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

    newSaveBtn.addEventListener('click', () => {
        const cat = categoryInput.value.trim();
        const itemText = itemInput.value.trim();

        if (!cat || !itemText) {
            alert('Please enter both category and item name');
            return;
        }

        Storage.editCustomSupply(id, cat, itemText);
        renderSupplies();
        bootstrap.Modal.getInstance(modal).hide();
    });

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

function deleteSupply(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        Storage.deleteCustomSupply(id);
        renderSupplies();
    }
}

function resetSupplies() {
    if (confirm('Are you sure you want to reset all supplies? This will uncheck all items.')) {
        Storage.resetSupplies();
        renderSupplies();
    }
}

function updateSuppliesProgress() {
    // Count total and checked items
    const suppliesData = Storage.getSupplies();
    const savedSupplies = suppliesData.checked || {};
    const customSupplies = suppliesData.custom || [];
    let total = 0;
    let checked = 0;

    // Count default supplies
    if (retreatData) {
        retreatData.supplies.forEach((category, catIndex) => {
            category.items.forEach((item, itemIndex) => {
                total++;
                const key = `${catIndex}_${itemIndex}`;
                if (savedSupplies[key]) checked++;
            });
        });
    }

    // Count custom supplies
    customSupplies.forEach(supply => {
        total++;
        const key = `custom_${supply.id}`;
        if (savedSupplies[key]) checked++;
    });

    const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

    // Update progress bars
    const progressBar = document.getElementById('suppliesProgressBar');
    const progressText = document.getElementById('suppliesProgressText');
    const homeProgress = document.getElementById('suppliesProgress');

    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
    if (progressText) {
        progressText.textContent = percentage + '%';
    }
    if (homeProgress) {
        homeProgress.style.width = percentage + '%';
        homeProgress.textContent = percentage + '%';
    }
}

// Make functions global
window.toggleSupply = toggleSupply;

// PDF Export Functions
function exportJournalPDF(type) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let yPos = 20;
    const pageHeight = doc.internal.pageSize.height;
    const marginBottom = 20;

    // Helper to add text with page breaks
    const addText = (text, fontSize = 12, style = 'normal') => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', style);

        const lines = doc.splitTextToSize(text, 170);
        lines.forEach(line => {
            if (yPos > pageHeight - marginBottom) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(line, 20, yPos);
            yPos += fontSize / 2 + 2;
        });
    };

    if (type === 'daily') {
        const date = document.getElementById('dailyDate')?.value;
        const data = Storage.getDailyReflection(date, currentUser);

        addText(`Daily Reflection - ${currentUser}`, 18, 'bold');
        yPos += 5;
        // Parse date as local time to avoid timezone issues
        addText(`Date: ${new Date(date + 'T00:00:00').toLocaleDateString()}`, 12);
        yPos += 10;

        if (data) {
            addText(`Intention: ${data.intention || 'N/A'}`, 12, 'bold');
            yPos += 5;
            addText(`Energy Level: ${data.energy || 'N/A'}/10`, 12);
            yPos += 10;

            addText('Key Insights:', 14, 'bold');
            addText(data.insights || 'N/A', 11);
            yPos += 5;

            addText('Moments of Clarity:', 14, 'bold');
            addText(data.clarity || 'N/A', 11);
            yPos += 5;

            addText('Gratitude:', 14, 'bold');
            addText(`1. ${data.gratitude1 || 'N/A'}`, 11);
            addText(`2. ${data.gratitude2 || 'N/A'}`, 11);
            addText(`3. ${data.gratitude3 || 'N/A'}`, 11);
            yPos += 5;

            addText('Action Items:', 14, 'bold');
            addText(`1. ${data.action1 || 'N/A'}`, 11);
            addText(`2. ${data.action2 || 'N/A'}`, 11);
            addText(`3. ${data.action3 || 'N/A'}`, 11);
            yPos += 5;

            addText('Challenges:', 14, 'bold');
            addText(data.challenges || 'N/A', 11);
            yPos += 5;

            addText('Ideas:', 14, 'bold');
            addText(data.ideas || 'N/A', 11);
            yPos += 5;

            addText('Tomorrow\'s Focus:', 14, 'bold');
            addText(data.tomorrow || 'N/A', 11);
        }
    } else if (type === 'future') {
        const data = Storage.getFutureLetter(currentUser);

        addText(`Letter to Future Self - ${currentUser}`, 18, 'bold');
        yPos += 5;
        addText('To be opened: April 23, 2026', 12, 'italic');
        yPos += 10;

        if (data && Object.keys(data).length > 0) {
            addText('Where We Were:', 14, 'bold');
            addText(data.whereWeWere || 'N/A', 11);
            yPos += 5;

            addText('Our Business Idea:', 14, 'bold');
            addText(data.businessIdea || 'N/A', 11);
            yPos += 5;

            addText('Personal Goals:', 14, 'bold');
            addText(`1. ${data.personalGoal1 || 'N/A'}`, 11);
            addText(`2. ${data.personalGoal2 || 'N/A'}`, 11);
            addText(`3. ${data.personalGoal3 || 'N/A'}`, 11);
        }
    }

    doc.save(`${currentUser}-${type}-journal-${new Date().toISOString().split('T')[0]}.pdf`);
}

function exportAllJournalsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let yPos = 20;

    doc.setFontSize(18);
    doc.text(`All Journal Entries - ${currentUser}`, 20, yPos);

    // This is a simplified version - in production, you'd want to iterate through all entries
    doc.save(`${currentUser}-all-journals-${new Date().toISOString().split('T')[0]}.pdf`);
    alert('Export complete!');
}

function exportToolPDF(tool) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let yPos = 20;
    const pageHeight = doc.internal.pageSize.height;
    const marginBottom = 20;

    // Helper to add text with page breaks
    const addText = (text, fontSize = 12, style = 'normal') => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', style);

        const lines = doc.splitTextToSize(text, 170);
        lines.forEach(line => {
            if (yPos > pageHeight - marginBottom) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(line, 20, yPos);
            yPos += fontSize / 2 + 2;
        });
    };

    if (tool === 'ikigai') {
        const data = Storage.getToolData('ikigai');
        addText(`Ikigai Diagram - ${currentUser}`, 18, 'bold');
        yPos += 10;

        addText('What You LOVE:', 14, 'bold');
        addText(data.love || 'Not yet filled in', 11);
        yPos += 5;

        addText('What You\'re GOOD AT:', 14, 'bold');
        addText(data.goodAt || 'Not yet filled in', 11);
        yPos += 5;

        addText('What You Can Be PAID FOR:', 14, 'bold');
        addText(data.paidFor || 'Not yet filled in', 11);
        yPos += 5;

        addText('What The World NEEDS:', 14, 'bold');
        addText(data.worldNeeds || 'Not yet filled in', 11);

    } else if (tool === 'swot') {
        const data = Storage.getToolData('swot_analyses');
        addText(`SWOT Analysis - ${currentUser}`, 18, 'bold');
        yPos += 10;

        addText('Strengths:', 14, 'bold');
        addText(data.strengths || 'Not yet filled in', 11);
        yPos += 5;

        addText('Weaknesses:', 14, 'bold');
        addText(data.weaknesses || 'Not yet filled in', 11);
        yPos += 5;

        addText('Opportunities:', 14, 'bold');
        addText(data.opportunities || 'Not yet filled in', 11);
        yPos += 5;

        addText('Threats:', 14, 'bold');
        addText(data.threats || 'Not yet filled in', 11);

    } else if (tool === 'value') {
        const data = Storage.getToolData('value_prop');
        addText(`Value Proposition Canvas - ${currentUser}`, 18, 'bold');
        yPos += 10;

        addText('CUSTOMER PROFILE', 16, 'bold');
        yPos += 5;

        addText('Customer Jobs:', 14, 'bold');
        addText(data.customerJobs || 'Not yet filled in', 11);
        yPos += 5;

        addText('Pains:', 14, 'bold');
        addText(data.pains || 'Not yet filled in', 11);
        yPos += 5;

        addText('Gains:', 14, 'bold');
        addText(data.gains || 'Not yet filled in', 11);
        yPos += 10;

        addText('VALUE MAP', 16, 'bold');
        yPos += 5;

        addText('Products/Services:', 14, 'bold');
        addText(data.products || 'Not yet filled in', 11);
        yPos += 5;

        addText('Pain Relievers:', 14, 'bold');
        addText(data.painRelievers || 'Not yet filled in', 11);
        yPos += 5;

        addText('Gain Creators:', 14, 'bold');
        addText(data.gainCreators || 'Not yet filled in', 11);

    } else if (tool === 'action') {
        const data = Storage.getToolData('action_plan');
        addText(`90-Day Action Plan - ${currentUser}`, 18, 'bold');
        yPos += 10;

        addText('Business Idea:', 14, 'bold');
        addText(data.businessIdea || 'Not yet filled in', 11);
        yPos += 5;

        addText('Vision Statement:', 14, 'bold');
        addText(data.vision || 'Not yet filled in', 11);
        yPos += 10;

        addText('MONTH 1', 16, 'bold');
        yPos += 5;
        addText('Goal:', 14, 'bold');
        addText(data.month1Goal || 'Not yet filled in', 11);
        yPos += 5;
        addText('Milestones:', 14, 'bold');
        addText(data.month1Milestones || 'Not yet filled in', 11);
        yPos += 10;

        addText('MONTH 2', 16, 'bold');
        yPos += 5;
        addText('Goal:', 14, 'bold');
        addText(data.month2Goal || 'Not yet filled in', 11);
        yPos += 5;
        addText('Milestones:', 14, 'bold');
        addText(data.month2Milestones || 'Not yet filled in', 11);
        yPos += 10;

        addText('MONTH 3', 16, 'bold');
        yPos += 5;
        addText('Goal:', 14, 'bold');
        addText(data.month3Goal || 'Not yet filled in', 11);
        yPos += 5;
        addText('Milestones:', 14, 'bold');
        addText(data.month3Milestones || 'Not yet filled in', 11);
    }

    doc.save(`${currentUser}-${tool}-${new Date().toISOString().split('T')[0]}.pdf`);
}

// Smooth Scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });
}
