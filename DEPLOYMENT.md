# Deployment Guide - Ashlyn Retreat Application

## Quick Start (Local Testing)

The easiest way to test the application:

1. Simply open `index.html` in any modern web browser
2. The app will run completely locally with no server required
3. All data is stored in your browser's LocalStorage

**Note**: Some browsers may restrict certain features (like localStorage) when opening files directly. If you encounter issues, use one of the server methods below.

---

## Option 1: Deploy to GitHub Pages (Recommended)

GitHub Pages is free and perfect for this application.

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon and select "New repository"
3. Name it `ashlyn-retreat` (or any name you prefer)
4. Choose "Public" or "Private"
5. Do NOT initialize with README (we have our own)
6. Click "Create repository"

### Step 2: Upload Files

**Option A: Using GitHub Web Interface**
1. Click "uploading an existing file"
2. Drag and drop ALL files and folders from this project
3. Commit the changes

**Option B: Using Git Command Line**
```bash
# Navigate to this project folder
cd "/d/AI Artifacts/Ashlyn Retreat"

# Initialize git (if not already)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - Ashlyn Retreat application"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/dillyn-raney/Ashlyn-Retreat.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "main" branch
5. Click "Save"
6. Wait 1-2 minutes for deployment

### Step 4: Access Your Site

Your site will be available at:
```
https://YOUR-USERNAME.github.io/ashlyn-retreat/
```

Replace `YOUR-USERNAME` with your GitHub username.

---

## Option 2: Run Local Development Server

If you want to test locally with full features:

### Using Python (Built-in)

**Python 3:**
```bash
cd "/d/AI Artifacts/Ashlyn Retreat"
python -m http.server 8000
```

**Python 2:**
```bash
cd "/d/AI Artifacts/Ashlyn Retreat"
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

### Using Node.js (http-server)

```bash
# Install http-server globally (one time)
npm install -g http-server

# Navigate to project
cd "/d/AI Artifacts/Ashlyn Retreat"

# Start server
http-server -p 8000

# Open http://localhost:8000
```

### Using PHP (Built-in)

```bash
cd "/d/AI Artifacts/Ashlyn Retreat"
php -S localhost:8000
```

Then open: `http://localhost:8000`

---

## Option 3: Deploy to Other Platforms

### Netlify

1. Go to [Netlify](https://www.netlify.com/)
2. Sign up/login
3. Drag and drop your project folder
4. Site deploys automatically
5. Get a free `https://yoursite.netlify.app` URL

### Vercel

1. Go to [Vercel](https://vercel.com/)
2. Sign up/login
3. Click "New Project"
4. Import from GitHub or upload folder
5. Deploy (automatic)

### Cloudflare Pages

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Sign up/login
3. Create a new project
4. Connect GitHub repo or upload files
5. Deploy

---

## File Checklist

Ensure all these files are uploaded:

```
✅ index.html
✅ README.md
✅ CLAUDE.md
✅ css/styles.css
✅ js/app.js
✅ js/storage.js
✅ js/calendar.js
✅ js/notifications.js
✅ data/retreat-data.json
```

Optional files:
- `.gitignore`
- `TESTING.md`
- `DEPLOYMENT.md` (this file)
- Original spec files (for reference)

---

## Post-Deployment Testing

After deploying, verify these features work:

1. **✅ Page loads** without errors
2. **✅ Navigation** works (all links)
3. **✅ User toggle** switches between Dillyn/Ashlee
4. **✅ Schedule** displays all 4 days
5. **✅ Journals** save and load correctly
6. **✅ Tools** auto-save properly
7. **✅ Kanban** board functional
8. **✅ Supplies** checklist works
9. **✅ Calendar export** downloads .ics files
10. **✅ PDF export** generates PDFs
11. **✅ Notifications** permission request works
12. **✅ Mobile responsive** design works

---

## Troubleshooting

### Issue: Page shows 404 error

**Solution**: Ensure `index.html` is in the root directory of your repository.

### Issue: Styles not loading

**Solution**:
- Check that `css/styles.css` exists
- Verify file paths are relative (no absolute paths)
- Check browser console for 404 errors

### Issue: JavaScript not working

**Solution**:
- Check browser console for errors
- Verify all `.js` files in `/js/` folder
- Ensure `data/retreat-data.json` exists

### Issue: LocalStorage not working

**Solution**:
- Don't use private/incognito mode (or accept data won't persist)
- Check browser localStorage isn't disabled
- Ensure site is served over HTTP/HTTPS (not file://)

### Issue: Notifications not working

**Solution**:
- Must be served over HTTPS (GitHub Pages is HTTPS)
- Browser must support Notification API
- User must grant permission

### Issue: PDF export not working

**Solution**:
- Check that jsPDF CDN is loading
- Check browser console for errors
- Verify browser allows downloads

---

## Custom Domain (Optional)

If you want to use your own domain with GitHub Pages:

1. Buy a domain from any registrar
2. In GitHub repo settings → Pages
3. Add your custom domain
4. Configure DNS at your registrar:
   - Add CNAME record pointing to `YOUR-USERNAME.github.io`
5. Wait for DNS propagation (up to 24 hours)

---

## Updating the Application

### Via GitHub Web Interface

1. Navigate to the file on GitHub
2. Click the pencil icon (Edit)
3. Make changes
4. Commit changes
5. Site updates automatically

### Via Git Command Line

```bash
# Make your changes locally
# Then:
git add .
git commit -m "Description of changes"
git push
```

GitHub Pages will automatically redeploy.

---

## Security & Privacy Notes

- ✅ **No backend**: Everything runs in browser
- ✅ **No tracking**: No analytics or external scripts (except CDNs)
- ✅ **Data privacy**: All data stored locally on user's device
- ✅ **HTTPS**: GitHub Pages serves over HTTPS automatically
- ✅ **No user accounts**: No passwords or authentication needed

---

## Performance Optimization (Optional)

For better performance:

1. **Minify CSS/JS**: Use tools like [UglifyJS](https://www.npmjs.com/package/uglify-js)
2. **Optimize images**: Compress any images you add
3. **Enable caching**: Configure via `_headers` file (Netlify/Cloudflare)
4. **Use CDN**: Already using Bootstrap/jsPDF via CDN ✓

---

## Backup Your Data

Users should periodically export their data:

1. Open Developer Console (F12)
2. Type: `Storage.exportAllData()`
3. Downloads JSON backup file
4. Save this file safely

To restore:
- Use import feature (if implemented)
- Or manually paste into console: `Storage.importData(file)`

---

## Support Resources

- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **Bootstrap Docs**: https://getbootstrap.com/docs/
- **MDN Web Docs**: https://developer.mozilla.org/
- **Testing Checklist**: See `TESTING.md`

---

## Final Checklist

Before sharing the deployed site:

- [ ] Test on desktop browser
- [ ] Test on mobile device
- [ ] Test all major features
- [ ] Verify data persists after refresh
- [ ] Check all navigation links
- [ ] Test PDF exports
- [ ] Test calendar exports
- [ ] Verify user toggle works
- [ ] Check spelling/grammar
- [ ] Review all retreat content
- [ ] Test in incognito/private mode

---

## Enjoy Your Retreat! ✨

Once deployed, bookmark the URL and use it during your October 23-26 retreat.

**Your deployed site**: `https://YOUR-USERNAME.github.io/ashlyn-retreat/`

May this application support your journey to purpose, prosperity, and partnership! 🌟
