# Testing Checklist for Ashlyn Retreat Application

## How to Test

1. Open `index.html` in a web browser (Chrome, Firefox, Safari, or Edge)
2. Open browser Developer Tools (F12) and check Console for errors
3. Go through each section below and verify functionality

---

## ✅ Basic Functionality

### Page Load
- [ ] Page loads without errors
- [ ] No console errors on initial load
- [ ] All CSS styles loaded correctly
- [ ] Bootstrap and custom fonts loaded
- [ ] Navigation bar displays correctly
- [ ] Hero section displays with retreat information

### Navigation
- [ ] All navigation links work
- [ ] Smooth scrolling to sections works
- [ ] User toggle button displays "Dillyn" initially
- [ ] Clicking user toggle switches to "Ashlee"
- [ ] Mobile hamburger menu works on small screens
- [ ] Navigation collapses after clicking a link on mobile

---

## 📅 Schedule Section

### Display
- [ ] All 4 days (Oct 23-26) display in accordion
- [ ] Thursday accordion opens by default
- [ ] Day titles and dates formatted correctly
- [ ] Activities display with time, title, description
- [ ] Energy level badges show correct colors (🟢🟡🔵)
- [ ] Duration displays for each activity

### Functionality
- [ ] Accordion expands/collapses correctly
- [ ] "Add Day to Calendar" button works
- [ ] Individual activity "Add to Calendar" buttons work
- [ ] .ics files download correctly
- [ ] "Enable Notifications" button requests permission
- [ ] "Export All to Calendar" button works

### Notifications
- [ ] Browser requests notification permission
- [ ] Permission status displays correctly
- [ ] (To test fully, would need to wait for 15-min window)

---

## 📔 Journal Section

### User Toggle
- [ ] Journals are separate for Dillyn and Ashlee
- [ ] Switching users loads correct data
- [ ] User name displays in UI

### Daily Reflection
- [ ] Date field defaults to today
- [ ] All form fields accept input
- [ ] Energy level slider updates value display
- [ ] Action items checkboxes work
- [ ] Save indicator shows "Saving..." then "Saved ✓"
- [ ] Data persists after page refresh
- [ ] Changing date loads saved data for that date
- [ ] "Export as PDF" button works

### Freeform Journal
- [ ] Date field works
- [ ] Prompt selector populates
- [ ] Selecting prompt fills textarea with prompt
- [ ] Textarea accepts input
- [ ] "Save Entry" button saves entry
- [ ] Confirmation message displays
- [ ] Form clears after save

### Letter to Future Self
- [ ] All fields accept input
- [ ] Auto-save indicator works
- [ ] "To be opened April 23, 2026" banner displays
- [ ] Data persists after refresh
- [ ] "Export as PDF" button works

### View All Journals
- [ ] Displays all saved entries
- [ ] Entries grouped by type (Daily, Freeform, Future)
- [ ] Dates formatted correctly
- [ ] "Export All" button works
- [ ] Switching users shows correct journals

---

## 🎯 Business Tools Section

### Ikigai
- [ ] All 4 input fields work
- [ ] SVG diagram displays
- [ ] Auto-save indicator works
- [ ] Data persists after refresh
- [ ] "Export" button generates PDF

### SWOT Analysis
- [ ] Idea name field works
- [ ] All 4 quadrants accept input
- [ ] Auto-save indicator works
- [ ] Data persists after refresh
- [ ] "Export" button generates PDF

### Value Proposition Canvas
- [ ] All 6 fields accept input (3 customer, 3 value)
- [ ] Auto-save indicator works
- [ ] Data persists after refresh
- [ ] "Export" button generates PDF

### Kanban Board
- [ ] "Add New Idea" button opens modal
- [ ] Modal form accepts input
- [ ] Can add card to any column
- [ ] Card displays in correct column
- [ ] Move buttons (← → ⭐) work
- [ ] Can only have ONE card in "Ready for Action"
- [ ] Alert shows if trying to add second to "Ready"
- [ ] Delete button works with confirmation
- [ ] Data persists after refresh

### 90-Day Action Plan
- [ ] All fields accept input
- [ ] Business idea and vision fields work
- [ ] All 3 monthly sections work
- [ ] Auto-save indicator works
- [ ] Data persists after refresh
- [ ] "Export Plan" button generates PDF

---

## 🍽️ Meals Section

### Recipes Tab
- [ ] All 3 recipes display
- [ ] Recipe cards show day, name, times
- [ ] Ingredients list displays with checkmarks
- [ ] Instructions display numbered
- [ ] Cards have proper styling and hover effects

### Snacks Tab
- [ ] All 8 snacks display
- [ ] Snack names and benefits show
- [ ] Cards layout responsively
- [ ] Icons display correctly

---

## ✅ Supplies Section

### Display
- [ ] All categories display (Tech, Wellness, Creative, Reading, Kitchen)
- [ ] All items listed under correct categories
- [ ] Progress bar displays at top
- [ ] Progress shows 0% initially

### Functionality
- [ ] Clicking checkbox checks/unchecks item
- [ ] Clicking item row checks/unchecks
- [ ] Checked items get strikethrough
- [ ] Progress bar updates correctly
- [ ] Progress percentage displays in bar
- [ ] "Reset All" button works
- [ ] Confirmation dialog shows for reset
- [ ] Data persists after refresh
- [ ] Home page progress bar updates

---

## 🏠 Home Section

### Display
- [ ] Retreat title and dates display
- [ ] Location information shows
- [ ] Icons display correctly

### Countdown Timer
- [ ] Timer displays days/hours/minutes
- [ ] Updates every minute
- [ ] Shows correct message if during retreat
- [ ] Shows completed message if after retreat

### Progress
- [ ] Supplies progress bar displays
- [ ] Updates when supplies checked
- [ ] Shows correct percentage

### Intention Box
- [ ] Displays retreat intention text
- [ ] Styled correctly

---

## 📚 Resources Section

- [ ] Atmosphere tips display
- [ ] Tech boundaries display
- [ ] Closing thoughts display
- [ ] Cards styled correctly

---

## 🎨 Design & Responsiveness

### Desktop (> 992px)
- [ ] Navigation horizontal
- [ ] All sections display correctly
- [ ] Multi-column layouts work
- [ ] Sidebar elements positioned correctly

### Tablet (768-991px)
- [ ] Navigation works
- [ ] Columns adjust appropriately
- [ ] Touch targets adequate
- [ ] No horizontal scrolling

### Mobile (< 768px)
- [ ] Hamburger menu works
- [ ] Single column layout
- [ ] All text readable
- [ ] Buttons accessible
- [ ] Forms usable
- [ ] No content cutoff
- [ ] Touch targets minimum 44x44px

### Print
- [ ] Navigation hidden in print view
- [ ] Content prints cleanly
- [ ] Page breaks appropriate
- [ ] No unnecessary elements

---

## 💾 Data Persistence

### LocalStorage
- [ ] Data saves automatically
- [ ] Data persists after browser close
- [ ] Data persists after page refresh
- [ ] Switching users loads correct data
- [ ] No data loss during normal use

### Auto-Save
- [ ] Saves on field blur
- [ ] Saves every 30 seconds while typing
- [ ] Save indicators work correctly
- [ ] No lag or performance issues

---

## 📤 Export Functions

### PDF Exports
- [ ] Daily reflection PDF downloads
- [ ] Future letter PDF downloads
- [ ] All journals PDF downloads
- [ ] Ikigai PDF downloads
- [ ] SWOT PDF downloads
- [ ] Value Prop PDF downloads
- [ ] Action Plan PDF downloads
- [ ] PDFs contain correct data
- [ ] PDFs formatted reasonably

### Calendar Exports
- [ ] Single activity .ics downloads
- [ ] Full day .ics downloads
- [ ] All schedule .ics downloads
- [ ] .ics files import to Google Calendar
- [ ] .ics files import to Outlook
- [ ] Event details correct

---

## 🔍 Browser Compatibility

### Chrome
- [ ] All features work
- [ ] No console errors
- [ ] Performance good

### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Performance good

### Safari
- [ ] All features work
- [ ] No console errors
- [ ] Performance good

### Edge
- [ ] All features work
- [ ] No console errors
- [ ] Performance good

---

## ♿ Accessibility

- [ ] Can navigate with keyboard only
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] Screen reader announces sections
- [ ] ARIA labels present where needed
- [ ] Color contrast sufficient
- [ ] Text resizable
- [ ] No flashing content

---

## 🐛 Error Handling

- [ ] No console errors during normal use
- [ ] Graceful handling if localStorage full
- [ ] Graceful handling if notifications blocked
- [ ] Graceful handling if PDF generation fails
- [ ] Alert messages clear and helpful
- [ ] No JavaScript errors crash the app

---

## 🚀 Performance

- [ ] Page loads quickly (< 3 seconds)
- [ ] No lag when typing
- [ ] Auto-save doesn't cause freezing
- [ ] Smooth scrolling works well
- [ ] Animations smooth
- [ ] No memory leaks over time

---

## ✨ Polish

- [ ] All fonts load correctly
- [ ] Icons display properly
- [ ] Colors match spec
- [ ] Spacing consistent
- [ ] Hover effects work
- [ ] Transitions smooth
- [ ] No broken images
- [ ] No Lorem ipsum or placeholder text
- [ ] All real retreat content present

---

## Testing Notes

**Date Tested**: _________________

**Browser**: _________________

**Issues Found**:
-
-
-

**Overall Assessment**: ☐ Pass  ☐ Needs Work  ☐ Fail

---

## Quick Smoke Test (5 minutes)

For a quick verification that basic functionality works:

1. [ ] Open index.html - page loads
2. [ ] Toggle user - switches between Dillyn/Ashlee
3. [ ] Click all nav links - sections scroll into view
4. [ ] Schedule - accordion opens/closes
5. [ ] Journal - type in daily reflection, see "Saved" indicator
6. [ ] Tools - type in SWOT field, see auto-save
7. [ ] Kanban - add a card, move it between columns
8. [ ] Meals - recipes and snacks display
9. [ ] Supplies - check item, see progress update
10. [ ] Refresh page - data still there

If all 10 pass, basic functionality is working! ✅
