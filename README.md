# The Ashlyn Retreat Web Application

A comprehensive single-page web application for the Ashlyn Retreat - a 4-day wellness and entrepreneurial retreat experience (October 23-26, 2025).

## Features

### 🗓️ Interactive Schedule
- Complete 4-day itinerary with times, activities, and energy levels
- Current activity highlighting
- Export activities to Google Calendar (.ics format)
- Browser notifications 15 minutes before each activity

### 📔 Dual-User Journaling System
- **Daily Reflection Template**: Structured journaling with intention, insights, gratitude, and action items
- **Freeform Journaling**: Open-ended entries with optional prompts
- **Letter to Future Self**: Special template to be opened April 23, 2026
- Separate journals for Dillyn and Ashlee
- Auto-save functionality (saves every 30 seconds + on field blur)
- Export individual or all journal entries as PDF

### 🎯 Business Planning Tools
- **Ikigai Diagram**: Visual representation of passion, skills, value, and purpose
- **SWOT Analysis**: Strengths, Weaknesses, Opportunities, and Threats framework
- **Value Proposition Canvas**: Customer profile and value map
- **Kanban Board**: Organize ideas with button-based navigation (Develop Further, Ready for Action ⭐, Parking Lot)
  - Enforces rule: Only ONE idea in "Ready for Action" at a time
- **90-Day Action Plan**: Structured monthly planning with milestones
- All tools feature auto-save and PDF export

### 🍽️ Meal Planning
- Three dinner recipes with ingredients and step-by-step instructions
- Brain-boosting snack guide with health benefits
- Print-friendly recipe cards

### ✅ Supply Checklist
- Interactive checklist organized by category (Tech, Wellness, Creative, Reading, Kitchen)
- Real-time progress tracking
- Persistent state across sessions
- Reset functionality

### 🔔 Notifications
- Browser notifications for upcoming activities (15-minute advance warning)
- Persistent notifications that require user dismissal
- Optional audio alerts

### 📤 Export Functions
- Export journals as PDF
- Export business tools as PDF
- Export schedule to Google Calendar
- Download all data as JSON backup

## Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom styling with Bootstrap 5.3+ framework
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **LocalStorage API** - Client-side data persistence
- **Bootstrap 5.3.2** - UI framework
- **Bootstrap Icons** - Icon library
- **jsPDF** - PDF generation
- **Google Fonts** - Playfair Display & Raleway

## Installation & Usage

### Option 1: Open Locally
1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No server required - runs entirely in the browser

### Option 2: Deploy to GitHub Pages
1. Create a new GitHub repository
2. Upload all files to the repository
3. Go to Settings → Pages
4. Select "main" branch as source
5. Your site will be available at `https://[username].github.io/[repo-name]/`

### Browser Requirements
- Modern browser with JavaScript enabled
- Chrome, Firefox, Safari, or Edge (latest versions)
- LocalStorage enabled
- Notification permissions (optional, for reminders)

## User Guide

### Getting Started
1. **Select Your Profile**: Click the user toggle button in the navigation to switch between Dillyn and Ashlee
2. **Enable Notifications**: Click "Enable Notifications" in the Schedule section to receive activity reminders
3. **Navigate Sections**: Use the navigation menu to explore different sections

### Using the Journal
- All journal entries auto-save as you type
- Select a date for Daily Reflection entries
- Use prompts for inspiration in Freeform journaling
- Export entries as PDF anytime

### Using Business Tools
- Fill out each tool's fields - they auto-save automatically
- **Kanban Board**: Add ideas, move them between columns using buttons
- Only one idea can be in "Ready for Action" at a time
- Export completed tools as PDF

### Supplies Checklist
- Click on items to check them off
- Progress bar updates automatically
- Reset all items with the "Reset All" button

### Data Management
- All data stored locally in your browser
- Clear browser data will delete all entries
- Export data as JSON backup for safekeeping
- No data sent to external servers

## File Structure

```
ashlyn-retreat/
├── index.html              # Main application
├── css/
│   └── styles.css         # Custom styles
├── js/
│   ├── app.js             # Main application logic
│   ├── storage.js         # LocalStorage management
│   ├── calendar.js        # Calendar integration
│   └── notifications.js   # Notification system
├── data/
│   └── retreat-data.json  # Schedule, recipes, prompts
├── assets/
│   └── images/            # (Optional) Images
├── README.md              # This file
└── CLAUDE.md              # Developer documentation
```

## Features in Detail

### Auto-Save System
The application implements a sophisticated auto-save system:
- Saves on field blur (when you leave a field)
- Auto-saves every 30 seconds while actively editing
- Visual "Saving..." and "Saved ✓" indicators
- No manual save buttons required

### Responsive Design
- Mobile-first design approach
- Touch-friendly targets (minimum 44x44px)
- Optimized for phones, tablets, and desktops
- Print-friendly styles for recipes and journals

### Accessibility
- WCAG 2.1 Level AA compliant
- Semantic HTML5 structure
- ARIA labels where needed
- Keyboard navigation support
- Sufficient color contrast (4.5:1 minimum)
- Screen reader friendly

### Data Persistence
All data stored in browser LocalStorage:
- User journals (separate for each user)
- Business tool data
- Supply checklist state
- User preferences
- Survives page refreshes and browser closures
- Export/import functionality for backups

## Color Palette

The application uses a calming wellness theme:
- **Primary**: #7FA99B (Sage green)
- **Secondary**: #C8B8A8 (Warm beige)
- **Accent**: #E8C4A1 (Soft peach)
- **Dark**: #4A5D5A (Deep forest)
- **Light**: #F5F3F0 (Off-white)
- **Success**: #88B398 (Energizing activities)
- **Warning**: #E8B87E (Moderate activities)
- **Info**: #A8BFCE (Restful activities)

## Browser Support

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Privacy & Security

- **No server communication**: All data stays on your device
- **No tracking**: No analytics or external scripts
- **No user accounts**: No passwords or personal info required
- **Data ownership**: You control all data via export/import
- **Private**: Use in private browsing if desired (data won't persist)

## Troubleshooting

### Notifications not working
1. Check browser notification permissions
2. Click "Enable Notifications" button in Schedule section
3. Ensure browser supports notifications API

### Data not saving
1. Check that browser allows LocalStorage
2. Ensure not in private/incognito mode (or accept that data won't persist)
3. Check browser storage quota

### Schedule not displaying
1. Ensure JavaScript is enabled
2. Check browser console for errors
3. Try refreshing the page

### Export not working
1. Check browser allows file downloads
2. Ensure popup blocker isn't blocking downloads

## Development

See `CLAUDE.md` for detailed development documentation including:
- Architecture overview
- Implementation guidelines
- Code organization
- Feature specifications
- Critical design decisions

## Credits

**Developed for**: Dillyn & Ashlee's Ashlyn Retreat
**Dates**: October 23-26, 2025
**Location**: The Glass House, Archer, FL

## License

This project is created for personal use. All rights reserved.

## Support

For issues or questions about using the application:
1. Check this README
2. Review browser console for errors
3. Try clearing browser cache and reloading

---

**May this retreat be the beginning of your greatest adventure together.** ✨
