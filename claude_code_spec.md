# The Ashlyn Retreat - Web Application Technical Specification

## Project Overview
Build a responsive single-page web application for a 4-day wellness and entrepreneurial retreat. The app will serve as an interactive guide with scheduling, journaling, and planning tools.

**Dates:** October 23-26, 2025  
**Users:** Dillyn & Ashlee (two-person retreat)  
**Hosting:** GitHub Pages (static HTML/CSS/JS)

---

## Technical Stack

### Required Technologies:
- **HTML5** - Semantic markup
- **CSS3** - Bootstrap 5.3+ framework
- **JavaScript (ES6+)** - Vanilla JS (no frameworks)
- **LocalStorage API** - Data persistence
- **Service Worker** - Optional for offline capability

### Third-Party Libraries:
- **Bootstrap 5.3+** (CSS/JS via CDN)
- **Bootstrap Icons** (via CDN)
- **jsPDF** library (for PDF export)
- **html2canvas** (for PDF generation if needed)

---

## Design Specifications

### Color Palette (Calming Wellness Theme):
```css
Primary: #7FA99B (Sage green)
Secondary: #C8B8A8 (Warm beige)
Accent: #E8C4A1 (Soft peach)
Dark: #4A5D5A (Deep forest)
Light: #F5F3F0 (Off-white)
Success: #88B398 (Muted green)
Warning: #E8B87E (Soft orange)
Info: #A8BFCE (Soft blue)
```

### Typography:
- **Headings:** 'Playfair Display' or 'Lora' (serif, elegant)
- **Body:** 'Raleway' or 'Montserrat' (sans-serif, clean)
- Import via Google Fonts

### Responsive Breakpoints:
- Mobile: 320px - 767px
- Tablet: 768px - 991px
- Desktop: 992px+

---

## File Structure

```
ashlyn-retreat/
│
├── index.html                 # Main application file
├── css/
│   └── styles.css            # Custom styles
├── js/
│   ├── app.js                # Main application logic
│   ├── storage.js            # LocalStorage management
│   ├── calendar.js           # Google Calendar integration
│   └── notifications.js      # Notification system
├── assets/
│   ├── images/               # Any images/icons
│   └── fonts/                # Custom fonts if needed
├── data/
│   └── retreat-data.json     # All retreat content (schedule, prompts, etc.)
└── README.md                 # GitHub documentation
```

---

## Core Features & Functionality

### 1. NAVIGATION & LAYOUT

**Main Navigation Tabs/Sections:**
1. **Home/Overview** - Welcome message, retreat goals, countdown timer
2. **Schedule** - Full itinerary with time blocks
3. **Journaling** - Templates and prompts for both users
4. **Tools & Templates** - SWOT, Ikigai, Value Prop Canvas, etc.
5. **Meal Plans** - Recipes and snack suggestions
6. **Supplies** - Checklist with checkboxes
7. **Resources** - Additional guides and information

**Navigation Style:**
- Fixed top navbar on desktop
- Collapsible hamburger menu on mobile
- Bottom navigation bar on mobile (alternative)
- Smooth scrolling between sections

---

### 2. SUPPLY CHECKLIST

**Features:**
- Interactive checkboxes for each item
- Items grouped by category (Tech, Kitchen, Wellness, etc.)
- Progress bar showing completion percentage
- State saved to localStorage
- "Reset All" button
- Print-friendly view

**Items List:**
```javascript
const supplies = [
  { category: "Tech", items: ["Speaker", "Computers", "Chargers"] },
  { category: "Wellness", items: ["Yoga mats (2)", "Eye masks", "Bug repellant", "Microdose", "Vyvanse"] },
  { category: "Creative", items: ["Journals (2)", "Paper", "Poster board", "Markers", "Tape", "Sticky notes", "Handpan"] },
  { category: "Reading", items: ["Think and Grow Rich book"] },
  { category: "Kitchen", items: ["Coffee supplies", "Snacks", "Dinner ingredients", "Lighter/matches"] }
];
```

---

### 3. SCHEDULE/ITINERARY

**Daily View Features:**
- Accordion-style collapsible days
- Each activity shows:
  - Time
  - Activity name
  - Energy level indicator (🟢 🟡 🔵 emoji or colored badge)
  - Duration
  - Notes/description
- Current time indicator (highlight current/next activity)
- "Add to Google Calendar" button for each day
- 15-minute advance notifications for upcoming activities

**Schedule Data Structure:**
```javascript
const schedule = {
  "2025-10-23": {
    day: "Thursday",
    title: "Arrival & Grounding",
    activities: [
      {
        time: "15:00",
        duration: 90,
        title: "Arrive & Settle In",
        energy: "moderate",
        description: "Unpack, explore the space, claim meditation spots",
        notificationMinutes: 15
      },
      // ... more activities
    ]
  },
  // ... more days
};
```

**Energy Level Colors:**
- 🟢 Energizing: Success color (#88B398)
- 🟡 Moderate: Warning color (#E8B87E)
- 🔵 Restful: Info color (#A8BFCE)

---

### 4. JOURNALING SYSTEM

**Two Separate User Profiles:**
- Toggle between "Dillyn" and "Ashlee"
- Each user has their own saved journal entries
- LocalStorage keys: `dillyn_journals` and `ashlee_journals`

**Journal Types:**

**A. Daily Reflection Template**
Fields:
- Date (auto-populated)
- Today's Intention (text)
- Energy Level (1-10 slider)
- Key Insights (textarea)
- Moments of Clarity (textarea)
- Challenges or Resistance (textarea)
- Ideas Generated (textarea)
- Action Items (3 checkboxes with text inputs)
- Gratitude (3 text inputs)
- Tomorrow's Focus (text)

**B. Freeform Journaling**
- Simple rich-text editor (or textarea)
- Timestamps
- Optional prompt selector

**C. Letter to Future Self**
- Special template (but not locked - users can view/edit anytime)
- Display label "To be opened April 23, 2026" prominently
- Includes personal and business goals
- Separate letters for each user (Dillyn & Ashlee)
- Export as PDF option

**Journal Prompts (Selectable):**
```javascript
const prompts = [
  "What is my biggest limiting belief right now?",
  "What is the one thing I must stop doing to achieve our Master Desire?",
  "How can our partnership create something greater than the sum of its parts?",
  "If money were no object, how would I spend my days?",
  "What does 'success' mean to me personally?",
  // ... (include all prompts from guide)
];
```

**Auto-Save Implementation:**
- Save to localStorage on every input blur event
- Also auto-save every 30 seconds while user is typing
- Display subtle "Saving..." and "Saved ✓" indicators
- No explicit "Save" button required
- Prevent data loss if browser closes unexpectedly

**Export Functionality:**
- Export individual journal entry as PDF
- Export all journals as combined PDF
- Export as plain text file
- Include user name and dates in export

---

### 5. BUSINESS PLANNING TOOLS

**A. Ikigai Diagram (Interactive SVG)**
- Four overlapping circles
- Input fields for each section
- Visual representation updates as you type
- Save button
- Export as image/PDF

**B. SWOT Analysis**
- 2x2 grid (Strengths, Weaknesses, Opportunities, Threats)
- Textarea for each quadrant
- Multiple SWOT analyses (for different business ideas)
- Save and name each analysis

**C. Value Proposition Canvas**
- Left circle (Customer Profile): Jobs, Pains, Gains
- Right square (Value Map): Products, Pain Relievers, Gain Creators
- Input fields for each section
- Save button

**D. Mini-Kanban Board**
- Three columns: "Develop Further", "Ready for Action", "Parking Lot"
- Button-based movement between columns (← → buttons on each card)
- Add/edit/delete cards
- Validation: Only ONE card allowed in "Ready for Action" (enforce with alert/modal)
- Each card displays in its column with action buttons
- Save state to localStorage

**E. 90-Day Action Plan**
- Form-based template
- Three monthly sections with milestones
- Accountability structure
- Progress tracking
- Export as PDF

---

### 6. MEAL PLANS & RECIPES

**Display:**
- Card-based layout for each recipe
- Expandable/collapsible sections
- Ingredients list with checkboxes
- Step-by-step instructions
- Prep time and cook time badges
- "Print Recipe" button for each

**Recipes:**
1. Thursday: Lemon Herb Salmon with Roasted Vegetables
2. Friday: Mediterranean Chicken Pasta
3. Saturday: Thai-Inspired Coconut Curry with Chicken

**Brain-Boosting Snacks Section:**
- Cards showing snack name, image/icon, and benefits
- Searchable/filterable

---

### 7. NOTIFICATIONS SYSTEM

**Browser Notifications:**
- Request permission on first load
- 15-minute advance warning for schedule items
- Notification includes activity name and time
- Sound alert (optional toggle)
- Notifications PERSIST until user dismisses them (do not auto-dismiss)
- "Dismiss" button required on each notification

**Implementation:**
```javascript
// Check every minute if notifications needed
setInterval(() => {
  checkUpcomingActivities();
}, 60000);

function checkUpcomingActivities() {
  const now = new Date();
  const in15min = new Date(now.getTime() + 15 * 60000);
  // Check schedule for activities starting in 15 minutes
  // Show notification if match found
}
```

---

### 8. GOOGLE CALENDAR INTEGRATION

**Add to Calendar Button:**
- Generates `.ics` file for download
- Works with Google Calendar, Outlook, Apple Calendar
- Include full day schedule or individual activities
- Format:
  - Event title
  - Start/end time
  - Location (The Glass House address)
  - Description (activity notes)

**Library:** Use a lightweight ICS generator or build custom function

---

### 9. DATA PERSISTENCE (LocalStorage)

**Storage Structure:**
```javascript
const storageKeys = {
  supplies: 'ashlyn_retreat_supplies',
  dillyn_journals: 'ashlyn_retreat_dillyn_journals',
  ashlee_journals: 'ashlyn_retreat_ashlee_journals',
  swot_analyses: 'ashlyn_retreat_swot',
  ikigai: 'ashlyn_retreat_ikigai',
  value_prop: 'ashlyn_retreat_value_prop',
  kanban: 'ashlyn_retreat_kanban',
  action_plan: 'ashlyn_retreat_action_plan',
  user_preferences: 'ashlyn_retreat_preferences'
};
```

**Functions:**
- `saveData(key, data)` - Save to localStorage
- `loadData(key)` - Retrieve from localStorage
- `exportAllData()` - Download all data as JSON backup
- `importData(file)` - Import backup file
- `clearAllData()` - Reset app (with confirmation)

---

### 10. ADDITIONAL FEATURES

**A. Progress Tracking:**
- Visual progress bars for:
  - Retreat days completed
  - Supplies packed
  - Journal entries filled
  - Business tools completed

**B. Timer/Countdown:**
- Countdown to retreat start date (if accessed before Oct 23)
- Current activity timer during retreat
- Break timer between activities

**C. Dark Mode (Optional):**
- Toggle between light/dark theme
- Save preference to localStorage
- Adjust color palette for dark mode

**D. Print Styles:**
- CSS media queries for print
- Print-friendly versions of:
  - Schedule
  - Recipes
  - Templates
  - Journal entries

---

## Implementation Guidelines

### Phase 1: Structure & Core Layout (Priority)
1. HTML structure with Bootstrap grid
2. Navigation system
3. All sections with placeholder content
4. Responsive design testing

### Phase 2: Content & Data (Priority)
1. Load all retreat content from JSON
2. Populate schedule, recipes, prompts
3. Display all static information

### Phase 3: Interactive Features (Priority)
1. Supply checklist with checkboxes
2. Journal system with user toggle
3. LocalStorage save/load
4. PDF export functionality

### Phase 4: Advanced Tools (Priority)
1. SWOT, Ikigai, Value Prop, Kanban
2. 90-Day Action Plan
3. Drag-and-drop functionality

### Phase 5: Enhancements (Nice to Have)
1. Notifications system
2. Google Calendar integration
3. Timer/countdown features
4. Dark mode

---

## User Interface Components

### Component List:

**1. Header/Hero Section**
- Retreat name/logo
- Dates and location
- Navigation menu
- User profile toggle (Dillyn/Ashlee)

**2. Card Components**
- Recipe cards
- Snack cards
- Activity cards
- Tool cards

**3. Form Components**
- Journal entry forms
- Business tool input forms
- Action plan forms

**4. Interactive Elements**
- Checkboxes (supplies)
- Sliders (energy level)
- Text areas (journal)
- Buttons (save, export, add to calendar)
- Accordion (schedule days)
- Tabs (navigation sections)
- Modal dialogs (confirmations, exports)

**5. Visual Indicators**
- Progress bars
- Energy level badges
- Time indicators
- Success/error messages (toast notifications)

---

## Testing Requirements

**Cross-Browser:**
- Chrome, Firefox, Safari, Edge (latest versions)

**Device Testing:**
- iPhone (Safari)
- Android phone (Chrome)
- iPad (Safari)
- Desktop (various sizes)

**Functionality Testing:**
- All buttons and links work
- Data saves correctly to localStorage
- Exports generate properly
- Notifications fire at correct times
- Google Calendar integration works
- Forms validate correctly

---

## Performance Considerations

**Optimization:**
- Lazy load images
- Minimize CSS/JS files
- Use CDN for Bootstrap
- Compress JSON data
- Cache static assets

**File Size Goals:**
- HTML: < 50KB
- CSS: < 100KB
- JS: < 150KB
- Total: < 500KB (excluding external CDN libraries)

---

## Accessibility (WCAG 2.1 Level AA)

**Requirements:**
- Semantic HTML5 tags
- ARIA labels where needed
- Keyboard navigation support
- Sufficient color contrast (4.5:1 minimum)
- Alt text for images
- Form labels properly associated
- Focus indicators visible
- Screen reader friendly

---

## Content to Include (From Guide)

**Full text from the retreat guide including:**
- Complete schedule for all 4 days with times, activities, energy levels
- All journal prompts (10 general + 20 couples prompts)
- Daily reflection template fields
- 3 complete dinner recipes with ingredients and instructions
- 8 brain-boosting snacks with benefits
- Supply checklist (20+ items)
- All framework templates (Ikigai, SWOT, Value Prop, Kanban, 90-Day Plan)
- Letter to future self template
- Strengths mapping for both people
- Retreat tips and closing thoughts

---

## Deployment

**GitHub Pages Setup:**
1. Create repository: `ashlyn-retreat`
2. Push all files to `main` branch
3. Enable GitHub Pages in repository settings
4. Site will be available at: `https://[username].github.io/ashlyn-retreat/`

**Repository Files:**
- Include README.md with:
  - Project description
  - How to use the app
  - Features list
  - Installation instructions (if running locally)
  - Credits

---

## Future Enhancements (Post-Retreat)

**Potential Additions:**
- Multi-retreat support (save different retreat data)
- Photo gallery from the retreat
- Retrospective journaling section
- Goal tracking dashboard
- Reminder emails (would require backend)
- Shared notes between Dillyn and Ashlee
- Video/audio recording integration
- Integration with project management tools (Trello API)

---

## Development Notes for Claude Code

**Key Implementation Points:**

1. **Single-Page Application:** All content should be in one HTML file or loaded dynamically. No page refreshes.

2. **LocalStorage is Critical:** Every interactive element must save its state. Implement save functions that trigger on blur/change events, not just explicit "Save" buttons.

3. **Mobile-First:** Design for mobile first, then enhance for larger screens. Touch-friendly button sizes (44x44px minimum).

4. **Bootstrap Usage:** Leverage Bootstrap's grid, utilities, and components. Customize colors via CSS variables or custom classes.

5. **PDF Export:** Use jsPDF with html2canvas to capture sections of the page and generate PDFs. Ensure proper formatting.

6. **Notification Permission:** Request browser notification permission early but not intrusively. Provide clear value proposition.

7. **Error Handling:** Gracefully handle:
   - LocalStorage quota exceeded
   - Browser notification permission denied
   - PDF generation failures
   - Invalid date inputs

8. **Data Validation:** Validate all user inputs, especially dates and required fields.

9. **User Experience:**
   - Loading states for async operations
   - Success messages after saves
   - Confirmation dialogs for destructive actions
   - Auto-save frequently (every 30 seconds while typing)

10. **Code Organization:**
    - Use modules/functions to organize code
    - Comment complex logic
    - Use meaningful variable names
    - Keep functions small and single-purpose

---

## Example Code Snippets

### LocalStorage Helper:
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
      console.error('Load failed:', e);
      return defaultValue;
    }
  },
  
  remove(key) {
    localStorage.removeItem(key);
  }
};
```

### Schedule Time Comparison:
```javascript
function isActivitySoon(activityTime, minutesAhead = 15) {
  const now = new Date();
  const activity = new Date();
  const [hours, minutes] = activityTime.split(':');
  activity.setHours(parseInt(hours), parseInt(minutes), 0);
  
  const diff = activity - now;
  const diffMinutes = diff / 60000;
  
  return diffMinutes > 0 && diffMinutes <= minutesAhead;
}
```

---

## Success Criteria

**The application is considered complete when:**
1. ✅ All content from the retreat guide is displayed correctly
2. ✅ Responsive design works on mobile, tablet, and desktop
3. ✅ All interactive features function properly
4. ✅ Data persists across browser sessions
5. ✅ PDFs export correctly
6. ✅ Notifications work (when permitted)
7. ✅ Google Calendar integration works
8. ✅ No console errors in browser
9. ✅ Accessible via GitHub Pages
10. ✅ User can complete entire retreat workflow using the app

---

## Timeline Estimate

**Total Development Time: 12-16 hours**
- Phase 1 (Structure): 2-3 hours
- Phase 2 (Content): 2-3 hours
- Phase 3 (Interactive): 4-5 hours
- Phase 4 (Advanced): 3-4 hours
- Phase 5 (Enhancements): 1-2 hours

---

## Implementation Decisions (CONFIRMED)

**The following design decisions have been confirmed by the client:**

1. **Kanban Board:** Use BUTTONS (not drag-and-drop). Users click buttons to move cards between columns.

2. **Journal Auto-Save:** Journals should AUTO-SAVE automatically. Save on blur events and every 30 seconds while typing. No explicit "Save" button needed (though a visual "Saved" indicator is good UX).

3. **Notifications:** Notifications should PERSIST until dismissed by the user. Do not auto-dismiss.

4. **Demo Mode:** Do NOT include a demo mode or sample data.

5. **Letter to Future Self:** Do NOT lock the letter until April 2026. Users can view/edit it anytime. Simply label it "To be opened April 23, 2026" but don't enforce the lock.

---

## Questions for Implementation

---

**END OF SPECIFICATION**

This spec provides all necessary information to build the Ashlyn Retreat web application. Refer back to the full retreat guide document for exact content to include.