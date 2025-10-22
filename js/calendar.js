// Google Calendar Integration (.ics file generation)

const Calendar = {
    location: 'The Glass House, 7505 SW 137th Ave, Archer, FL 32618',

    // Generate ICS file content
    generateICS(events) {
        const lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Ashlyn Retreat//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH'
        ];

        events.forEach(event => {
            lines.push('BEGIN:VEVENT');
            lines.push(`UID:${event.uid}@ashlynretreat.com`);
            lines.push(`DTSTAMP:${this.formatDateTime(new Date())}`);
            lines.push(`DTSTART:${this.formatDateTime(event.start)}`);
            lines.push(`DTEND:${this.formatDateTime(event.end)}`);
            lines.push(`SUMMARY:${this.escapeText(event.title)}`);
            lines.push(`DESCRIPTION:${this.escapeText(event.description)}`);
            lines.push(`LOCATION:${this.escapeText(this.location)}`);
            lines.push('STATUS:CONFIRMED');
            lines.push('END:VEVENT');
        });

        lines.push('END:VCALENDAR');

        return lines.join('\r\n');
    },

    // Format date-time for ICS
    formatDateTime(date) {
        const pad = (n) => n.toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${year}${month}${day}T${hours}${minutes}${seconds}`;
    },

    // Escape special characters for ICS
    escapeText(text) {
        return text
            .replace(/\\/g, '\\\\')
            .replace(/;/g, '\\;')
            .replace(/,/g, '\\,')
            .replace(/\n/g, '\\n');
    },

    // Download ICS file
    downloadICS(content, filename) {
        const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    // Create event from activity
    createEventFromActivity(date, activity) {
        const [hours, minutes] = activity.time.split(':');
        const startDate = new Date(date);
        startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const endDate = new Date(startDate);
        endDate.setMinutes(endDate.getMinutes() + activity.duration);

        return {
            uid: `${date}-${activity.time}-${activity.title.replace(/\s+/g, '-')}`,
            start: startDate,
            end: endDate,
            title: activity.title,
            description: `${activity.description}\n\nEnergy Level: ${activity.energy}\nDuration: ${activity.duration} minutes`
        };
    },

    // Export single activity
    exportActivity(date, activity) {
        const event = this.createEventFromActivity(date, activity);
        const icsContent = this.generateICS([event]);
        const filename = `ashlyn-retreat-${activity.title.replace(/\s+/g, '-').toLowerCase()}.ics`;
        this.downloadICS(icsContent, filename);
    },

    // Export full day schedule
    exportDay(date, activities) {
        const events = activities.map(activity => this.createEventFromActivity(date, activity));
        const icsContent = this.generateICS(events);
        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        const filename = `ashlyn-retreat-${dayName.toLowerCase()}.ics`;
        this.downloadICS(icsContent, filename);
    },

    // Export entire retreat schedule
    exportAllSchedule(scheduleData) {
        const allEvents = [];

        Object.entries(scheduleData).forEach(([date, dayData]) => {
            dayData.activities.forEach(activity => {
                allEvents.push(this.createEventFromActivity(date, activity));
            });
        });

        const icsContent = this.generateICS(allEvents);
        this.downloadICS(icsContent, 'ashlyn-retreat-full-schedule.ics');
    }
};

// Export for use in other modules
window.Calendar = Calendar;
