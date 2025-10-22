// Firebase Authentication Handlers
// UI event handlers for Firebase authentication

// Setup Firebase UI handlers (called by app.js after Firebase init)
function setupFirebaseUI() {
    console.log('Setting up Firebase UI handlers...');

    // Toggle between sign in and sign up forms
    document.getElementById('showSignUp')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('signInForm').style.display = 'none';
        document.getElementById('signUpForm').style.display = 'block';
        clearAuthMessages();
    });

    document.getElementById('showSignIn')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('signUpForm').style.display = 'none';
        document.getElementById('signInForm').style.display = 'block';
        clearAuthMessages();
    });

    // Continue offline
    document.getElementById('continueOffline')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('authModal').style.display = 'none';
        // Initialize app in offline mode
        if (window.initializeApp) {
            window.initializeApp();
        }
    });

    // Sign in button
    document.getElementById('signInBtn')?.addEventListener('click', async () => {
        const email = document.getElementById('signInEmail').value.trim();
        const password = document.getElementById('signInPassword').value;

        if (!email || !password) {
            showAuthError('Please enter email and password');
            return;
        }

        showLoading('signInBtn', true);
        const result = await FirebaseSync.signIn(email, password);
        showLoading('signInBtn', false);

        if (result.success) {
            showAuthSuccess('Signed in successfully!');
            clearAuthForms();
        } else {
            showAuthError(result.error);
        }
    });

    // Sign up button
    document.getElementById('signUpBtn')?.addEventListener('click', async () => {
        const name = document.getElementById('signUpName').value.trim();
        const email = document.getElementById('signUpEmail').value.trim();
        const password = document.getElementById('signUpPassword').value;

        if (!name || !email || !password) {
            showAuthError('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            showAuthError('Password must be at least 6 characters');
            return;
        }

        showLoading('signUpBtn', true);
        const result = await FirebaseSync.signUp(email, password, name);
        showLoading('signUpBtn', false);

        if (result.success) {
            showAuthSuccess('Account created successfully!');
            clearAuthForms();
        } else {
            showAuthError(result.error);
        }
    });

    // Sign out button
    document.getElementById('signOutBtn')?.addEventListener('click', async () => {
        if (confirm('Are you sure you want to sign out?')) {
            await FirebaseSync.signOut();
            window.location.reload();
        }
    });

    // Enter key handlers
    document.getElementById('signInPassword')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('signInBtn').click();
        }
    });

    document.getElementById('signUpPassword')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('signUpBtn').click();
        }
    });
}

// Show auth error message
function showAuthError(message) {
    const errorDiv = document.getElementById('authError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Show auth success message
function showAuthSuccess(message) {
    const successDiv = document.getElementById('authSuccess');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }
}

// Clear auth messages
function clearAuthMessages() {
    const errorDiv = document.getElementById('authError');
    const successDiv = document.getElementById('authSuccess');
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
}

// Clear auth forms
function clearAuthForms() {
    const fields = ['signInEmail', 'signInPassword', 'signUpName', 'signUpEmail', 'signUpPassword'];
    fields.forEach(id => {
        const field = document.getElementById(id);
        if (field) field.value = '';
    });
}

// Show loading state on button
function showLoading(buttonId, loading) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    if (loading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Please wait...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText;
    }
}

// Auth state change handler
window.onAuthStateChanged = (user) => {
    console.log('Auth state changed:', user ? user.email : 'not logged in');

    const syncStatusBar = document.getElementById('syncStatusBar');

    if (user) {
        if (syncStatusBar) syncStatusBar.style.display = 'block';
        updateSyncStatus(true, user.email);
    } else {
        if (syncStatusBar) syncStatusBar.style.display = 'none';
        updateSyncStatus(false);
    }
};

// Data synced handler
window.onDataSynced = () => {
    console.log('Data synced from Firebase');
    if (typeof loadJournalData === 'function') loadJournalData();
    if (typeof loadToolsData === 'function') loadToolsData();
    if (typeof renderSupplies === 'function') renderSupplies();
    if (typeof renderKanban === 'function') renderKanban();
};

// Update sync status display
function updateSyncStatus(synced, email = null) {
    const statusElement = document.getElementById('syncStatus');
    if (!statusElement) return;

    if (synced) {
        const emailText = email ? ` - ${email}` : '';
        statusElement.innerHTML = `
            <i class="bi bi-cloud-check text-success"></i>
            <small class="text-success">Synced${emailText}</small>
        `;
    } else {
        statusElement.innerHTML = `
            <i class="bi bi-cloud-slash text-muted"></i>
            <small class="text-muted">Offline Mode</small>
        `;
    }
}

// Manual sync function
async function manualSync() {
    const result = await FirebaseSync.manualSync();
    if (result.success) {
        console.log('Manual sync completed');
    } else {
        console.error('Manual sync failed:', result.message);
    }
}

// Export functions
window.setupFirebaseUI = setupFirebaseUI;
window.manualSync = manualSync;
