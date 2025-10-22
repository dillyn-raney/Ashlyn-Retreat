// Browser Notifications System

const Notifications = {
    enabled: false,
    checkInterval: null,
    notifiedActivities: new Set(),

    // Request notification permission
    async requestPermission() {
        if (!('Notification' in window)) {
            alert('This browser does not support notifications.');
            return false;
        }

        if (Notification.permission === 'granted') {
            this.enabled = true;
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.enabled = true;
                alert('Notifications enabled! You will receive reminders 15 minutes before each activity.');
                return true;
            }
        }

        if (Notification.permission === 'denied') {
            alert('Notifications are blocked. Please enable them in your browser settings.');
        }

        return false;
    },

    // Show notification
    show(title, options = {}) {
        if (!this.enabled || Notification.permission !== 'granted') {
            return null;
        }

        const defaultOptions = {
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%237FA99B"/><text x="50" y="60" font-size="40" text-anchor="middle" fill="white">AR</text></svg>',
            badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%237FA99B"/></svg>',
            requireInteraction: true, // Don't auto-dismiss
            ...options
        };

        return new Notification(title, defaultOptions);
    },

    // Start checking for upcoming activities
    startChecking(scheduleData) {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }

        // Check every minute
        this.checkInterval = setInterval(() => {
            this.checkUpcomingActivities(scheduleData);
        }, 60000);

        // Also check immediately
        this.checkUpcomingActivities(scheduleData);
    },

    // Stop checking
    stopChecking() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    },

    // Check for activities starting in 15 minutes
    checkUpcomingActivities(scheduleData) {
        if (!this.enabled) return;

        const now = new Date();
        const in15Minutes = new Date(now.getTime() + 15 * 60000);

        // Get today's date in YYYY-MM-DD format
        const todayKey = now.toISOString().split('T')[0];
        const dayData = scheduleData[todayKey];

        if (!dayData) return;

        dayData.activities.forEach(activity => {
            const [hours, minutes] = activity.time.split(':');
            const activityTime = new Date(now);
            activityTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            // Check if activity starts in about 15 minutes
            const timeDiff = activityTime - now;
            const minutesDiff = Math.floor(timeDiff / 60000);

            // Notify if between 14-16 minutes (gives 2-minute window)
            if (minutesDiff >= 14 && minutesDiff <= 16) {
                const activityKey = `${todayKey}-${activity.time}-${activity.title}`;

                // Only notify once per activity
                if (!this.notifiedActivities.has(activityKey)) {
                    this.notifiedActivities.add(activityKey);

                    const notification = this.show(
                        `Upcoming: ${activity.title}`,
                        {
                            body: `Starting in 15 minutes at ${activity.time}\n\n${activity.description}`,
                            tag: activityKey
                        }
                    );

                    // Optional: Play sound (browser support varies)
                    this.playNotificationSound();
                }
            }
        });

        // Clean up old notifications from set (older than 2 hours)
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60000);
        this.notifiedActivities.forEach(key => {
            const [dateStr] = key.split('-');
            const notifDate = new Date(dateStr);
            if (notifDate < twoHoursAgo) {
                this.notifiedActivities.delete(key);
            }
        });
    },

    // Play notification sound (optional)
    playNotificationSound() {
        try {
            // Create a simple beep using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            // Sound failed, but that's okay
            console.log('Could not play notification sound:', e);
        }
    },

    // Get current activity
    getCurrentActivity(scheduleData) {
        const now = new Date();
        const todayKey = now.toISOString().split('T')[0];
        const dayData = scheduleData[todayKey];

        if (!dayData) return null;

        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();

        for (let i = 0; i < dayData.activities.length; i++) {
            const activity = dayData.activities[i];
            const [hours, minutes] = activity.time.split(':');
            const activityStart = parseInt(hours) * 60 + parseInt(minutes);
            const activityEnd = activityStart + activity.duration;
            const currentTime = currentHours * 60 + currentMinutes;

            if (currentTime >= activityStart && currentTime < activityEnd) {
                return {
                    ...activity,
                    index: i
                };
            }
        }

        return null;
    },

    // Get next activity
    getNextActivity(scheduleData) {
        const now = new Date();
        const todayKey = now.toISOString().split('T')[0];
        const dayData = scheduleData[todayKey];

        if (!dayData) return null;

        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTime = currentHours * 60 + currentMinutes;

        for (let activity of dayData.activities) {
            const [hours, minutes] = activity.time.split(':');
            const activityStart = parseInt(hours) * 60 + parseInt(minutes);

            if (activityStart > currentTime) {
                return activity;
            }
        }

        return null;
    }
};

// Export for use in other modules
window.Notifications = Notifications;
