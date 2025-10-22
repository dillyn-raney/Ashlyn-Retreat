# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Ashlyn Retreat is a responsive single-page web application for a 4-day wellness and entrepreneurial retreat (October 23-26, 2025). The application serves as an interactive guide with scheduling, journaling, and business planning tools for two participants.

**Tech Stack:** HTML5, CSS3 (Bootstrap 5.3+), Vanilla JavaScript (ES6+), LocalStorage API
**Deployment:** GitHub Pages (static site)
**Users:** Two-person retreat with separate user profiles (Dillyn & Ashlee)

## Core Architecture

### Single-Page Application Design
- All functionality in one HTML file or dynamically loaded
- No page refreshes - smooth section transitions
- Navigation via tabs/sections with smooth scrolling
- Mobile-first responsive design (breakpoints: 320px, 768px, 992px)

### Data Persistence Strategy
The application relies entirely on browser LocalStorage for data persistence:

```javascript
storageKeys = {
  supplies: 'ashlyn_retreat_supplies',
  dillyn_journals: 'ashlyn_retreat_dillyn_journals',
  ashlee_journals: 'ashlyn_retreat_ashlee_journals',
  swot_analyses: 'ashlyn_retreat_swot',
  ikigai: 'ashlyn_retreat_ikigai',
  value_prop: 'ashlyn_retreat_value_prop',
  kanban: 'ashlyn_retreat_kanban',
  action_plan: 'ashlyn_retreat_action_plan',
  user_preferences: 'ashlyn_retreat_preferences'
}
```

**Critical Implementation Detail:** All interactive elements MUST auto-save. Never rely on explicit "Save" buttons. Implement saves on:
- Blur events (when user leaves a field)
- Auto-save every 30 seconds while user is actively typing
- Display subtle "Saving..." and "Saved ✓" indicators

### Dual User System
- Toggle between two user profiles (Dillyn & Ashlee)
- Each user has completely separate journal entries
- Use localStorage with user-specific keys
- Display current user prominently in UI
- All journaling features must respect user context

## Key Technical Requirements

### File Structure
```
ashlyn-retreat/
├── index.html              # Main SPA file
├── css/
│   └── styles.css         # Custom styles (Bootstrap overrides)
├── js/
│   ├── app.js             # Main application logic
│   ├── storage.js         # LocalStorage management
│   ├── calendar.js        # Google Calendar (.ics) integration
│   └── notifications.js   # Browser notification system
├── data/
│   └── retreat-data.json  # All schedule, prompts, recipes
└── assets/
    └── images/            # Icons, graphics
```

### Color Palette (Wellness Theme)
```css
--primary: #7FA99B;      /* Sage green */
--secondary: #C8B8A8;    /* Warm beige */
--accent: #E8C4A1;       /* Soft peach */
--dark: #4A5D5A;         /* Deep forest */
--light: #F5F3F0;        /* Off-white */
--success: #88B398;      /* Energizing - 🟢 */
--warning: #E8B87E;      /* Moderate - 🟡 */
--info: #A8BFCE;         /* Restful - 🔵 */
```

### Typography
- Headings: 'Playfair Display' or 'Lora' (serif)
- Body: 'Raleway' or 'Montserrat' (sans-serif)
- Import via Google Fonts CDN

## Feature Implementation Guidelines

### Schedule System
- Data structure: 4 days (Oct 23-26, 2025) with time-based activities
- Each activity includes: time, duration, title, energy level (energizing/moderate/restful), description
- Energy levels display with color-coded badges matching palette
- Current time indicator highlights current/next activity
- Generate `.ics` files for Google Calendar export (individual activities or full days)
- Browser notifications: 15-minute advance warning, PERSIST until dismissed (no auto-dismiss)

### Journaling System
Three journal types per user:

**1. Daily Reflection Template**
- 10 structured fields: intention, energy level (1-10 slider), insights, clarity moments, challenges, ideas, action items (3 checkboxes), gratitude (3 fields), tomorrow's focus
- Auto-save on blur + every 30 seconds

**2. Freeform Journaling**
- Simple textarea with timestamps
- Optional prompt selector (10 general prompts + 20 couples prompts available)

**3. Letter to Future Self**
- Special template (open date: April 23, 2026)
- Display "To be opened April 23, 2026" label but DO NOT lock access
- Separate letters for each user
- Export as PDF functionality

**Export Requirements:**
- Individual entry as PDF
- All journals as combined PDF
- Plain text export option
- Include user name and dates

### Business Planning Tools

**Kanban Board - IMPORTANT IMPLEMENTATION DETAIL:**
- Three columns: "Develop Further", "Ready for Action" ⭐, "Parking Lot"
- Use BUTTONS for card movement (NOT drag-and-drop)
- Cards display in columns with ← → action buttons
- Enforce rule: Only ONE card allowed in "Ready for Action" (show alert/modal if violated)
- Add/edit/delete cards functionality

**Other Tools:**
- Interactive Ikigai Diagram (SVG with 4 overlapping circles)
- SWOT Analysis (2x2 grid, multiple analyses supported)
- Value Proposition Canvas (customer profile + value map)
- 90-Day Action Plan (3 monthly sections with milestones)

All tools must save to localStorage and offer PDF export.

### Supply Checklist
- Interactive checkboxes grouped by category (Tech, Wellness, Creative, Reading, Kitchen)
- Progress bar showing completion percentage
- "Reset All" button with confirmation
- State persists via localStorage
- Print-friendly view

### Notification System
```javascript
// Check every minute for upcoming activities
setInterval(checkUpcomingActivities, 60000);

function checkUpcomingActivities() {
  const now = new Date();
  const in15min = new Date(now.getTime() + 15 * 60000);
  // Match against schedule data
  // Show notification with activity name and time
  // MUST persist until user dismisses
}
```

Request browser notification permission on first load (clear value proposition).

## Content Data

All retreat content is defined in the specification documents:

**Schedule:** 4 days, ~10 activities per day with precise times
**Recipes:** 3 dinner recipes (Lemon Herb Salmon, Mediterranean Chicken Pasta, Thai Coconut Curry)
**Snacks:** 8 brain-boosting snacks with benefits
**Supplies:** 20+ items across 5 categories
**Prompts:** 10 general + 20 couples conversation starters
**Templates:** Complete frameworks for SWOT, Ikigai, Value Prop, Kanban, 90-Day Plan

Reference `claude_code_spec.md` for full content details.

## Performance & Accessibility

### Performance Targets
- Total bundle size: < 500KB (excluding external CDN libraries)
- Lazy load images
- Use CDN for Bootstrap and external libraries
- Minify CSS/JS for production

### Accessibility (WCAG 2.1 Level AA)
- Semantic HTML5 tags throughout
- ARIA labels where semantic HTML insufficient
- Full keyboard navigation support
- Color contrast ratio: minimum 4.5:1
- Form labels properly associated with inputs
- Visible focus indicators
- Screen reader friendly

## Testing Requirements

**Cross-Browser:** Chrome, Firefox, Safari, Edge (latest versions)
**Devices:** iPhone, Android phone, iPad, Desktop (various sizes)
**Functionality:**
- LocalStorage save/load operations
- PDF generation (jsPDF + html2canvas)
- .ics calendar file generation
- Browser notifications
- Form validation
- Data export/import

## Critical Implementation Decisions

These decisions have been confirmed and should NOT be changed:

1. **Auto-Save:** Journals auto-save automatically. No explicit "Save" buttons (though visual indicators are good UX)
2. **Kanban Navigation:** Use BUTTONS to move cards, not drag-and-drop
3. **Notifications:** PERSIST until user dismisses. Do not auto-dismiss
4. **Letter to Future Self:** Label but do NOT lock until April 2026. Users can access anytime
5. **No Demo Mode:** Do not include sample/demo data
6. **Mobile-First:** Design for mobile screens first, enhance for larger displays
7. **Touch Targets:** Minimum 44x44px for all interactive elements

## Error Handling

Gracefully handle:
- LocalStorage quota exceeded
- Browser notification permission denied
- PDF generation failures
- Invalid date/time inputs
- Missing user data on first load

Display user-friendly error messages with clear next steps.

## Development Workflow

### Phase Order
1. **Structure & Layout:** HTML structure, Bootstrap grid, navigation, all sections with placeholders
2. **Content & Data:** Load retreat content from JSON, populate schedule/recipes/prompts
3. **Interactive Features:** Supply checklist, journal system with user toggle, localStorage persistence
4. **Advanced Tools:** Business planning tools (SWOT, Ikigai, Value Prop, Kanban, 90-Day Plan)
5. **Enhancements:** Notifications, calendar integration, timers, dark mode (optional)

### Code Organization Principles
- Use modules/functions to organize code
- Keep functions small and single-purpose
- Comment complex logic thoroughly
- Meaningful variable names
- Separate concerns: storage.js, calendar.js, notifications.js

### LocalStorage Helper Pattern
```javascript
const Storage = {
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage failed:', e);
      return false;
    }
  },
  load(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }
};
```

## Deployment

**GitHub Pages Setup:**
1. Repository: `ashlyn-retreat` (or similar)
2. Push to `main` branch
3. Enable GitHub Pages in repository settings
4. Site URL: `https://[username].github.io/ashlyn-retreat/`

Include README.md with project description, features, usage instructions.

## Reference Documents

- `ashlyn_retreat_guide.md` - Complete retreat content, schedule, prompts, recipes, frameworks
- `claude_code_spec.md` - Detailed technical specification, all requirements, implementation notes

These documents contain the source of truth for all content and functionality.
