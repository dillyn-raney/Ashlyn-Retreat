// Firebase Authentication Handlers
// Add this code to app.js or load as separate script

// Initialize Firebase when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Try to initialize Firebase
    const firebaseInitialized = await FirebaseSync.init();

    if (firebaseInitialized) {
        console.log('Firebase enabled');
        setupFirebaseUI();
    } else {
        console.log('Firebase disabled, using offline mode');
        // Hide auth modal, show app content
        document.getElementById('authModal').style.display = 'none';
        document.getElementById('appContent').style.display = 'block';
    }
});

// Setup Firebase UI handlers
function setupFirebaseUI() {
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
        document.getElementById('appContent').style.display = 'block';
        showAuthMessage('info', 'Running in offline mode. Data will only be stored on this device.');
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
            showAuthSuccess('Account created! Signing you in...');
            clearAuthForms();
        } else {
            showAuthError(result.error);
        }
    });

    // Sign out button
    document.getElementById('signOutBtn')?.addEventListener('click', async () => {
        if (confirm('Are you sure you want to sign out?')) {
            const result = await FirebaseSync.signOut();
            if (result.success) {
                showAuthMessage('info', 'Signed out successfully');
            }
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
    document.getElementById('authError').style.display = 'none';
    document.getElementById('authSuccess').style.display = 'none';
}

// Clear auth forms
function clearAuthForms() {
    document.getElementById('signInEmail').value = '';
    document.getElementById('signInPassword').value = '';
    document.getElementById('signUpName').value = '';
    document.getElementById('signUpEmail').value = '';
    document.getElementById('signUpPassword').value = '';
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

// Show general auth message
function showAuthMessage(type, message) {
    // Could use toast notification or alert
    console.log(`[${type}] ${message}`);
}

// Auth state change handler
window.onAuthStateChanged = (user) => {
    const syncStatusBar = document.getElementById('syncStatusBar');

    if (user) {
        // User is signed in
        if (syncStatusBar) {
            syncStatusBar.style.display = 'block';
        }

        // Update sync status
        updateSyncStatus(true, user.email);

        // Show notification
        showAuthMessage('success', 'Syncing data across devices...');
    } else {
        // User is signed out
        if (syncStatusBar) {
            syncStatusBar.style.display = 'none';
        }

        // Update sync status
        updateSyncStatus(false);
    }
};

// Data synced handler
window.onDataSynced = () => {
    console.log('Data synced from Firebase');

    // Reload journal data
    if (typeof loadJournalData === 'function') {
        loadJournalData();
    }

    // Reload tools data
    if (typeof loadToolsData === 'function') {
        loadToolsData();
    }

    // Update supplies
    if (typeof renderSupplies === 'function') {
        renderSupplies();
    }

    // Reload kanban
    if (typeof renderKanban === 'function') {
        renderKanban();
    }
};

// Update sync status display
function updateSyncStatus(synced, email = null) {
    const statusElement = document.getElementById('syncStatus');
    if (!statusElement) return;

    if (synced) {
        statusElement.innerHTML = `
            <i class="bi bi-cloud-check text-success"></i>
            <small class="text-success">Synced${email ? ` - ${email}` : ''}</small>
        `;
    } else {
        statusElement.innerHTML = `
            <i class="bi bi-cloud-slash text-muted"></i>
            <small class="text-muted">Offline Mode</small>
        `;
    }
}

// Manual sync button (can add to UI if desired)
async function manualSync() {
    const result = await FirebaseSync.manualSync();
    if (result.success) {
        showAuthMessage('success', 'Manual sync completed');
    } else {
        showAuthMessage('error', result.message);
    }
}

// Export manual sync function
window.manualSync = manualSync;
