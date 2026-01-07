# 🎬 AniCrew Backend Integration Guide

## ✅ Files Already Added (Automatic)

Main automatically **8 files** tumhare repo mein add kar di hain via Pipedream:

1. ✅ `src/utils/api.ts` - Complete API utility
2. ✅ `src/components/GoogleLogin.tsx` - Google OAuth login
3. ✅ `src/components/ThemeSwitcher.tsx` - Theme switcher
4. ✅ `src/styles/themes.css` - Theme animations (Space Odyssey, Solar Flare, Ghibli)
5. ✅ `src/pages/AnimeBrowse.tsx` - Anime browse with filters
6. ✅ `src/pages/DonghuaBrowse.tsx` - Donghua browse
7. ✅ `src/pages/WatchlistPage.tsx` - Watchlist with share
8. ✅ `src/pages/WatchPage.tsx` - Video player + comments

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install @react-oauth/google
```

### Step 2: Import Theme CSS

Add to your main `App.tsx` or `main.tsx`:

```typescript
import './styles/themes.css';
```

### Step 3: Add Theme State to App

Update your `App.tsx`:

```typescript
import { useState, useEffect } from 'react';
import ThemeSwitcher from './components/ThemeSwitcher';
import './styles/themes.css';

function App() {
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('anicrew_theme');
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('anicrew_theme', newTheme);
  };

  return (
    <div className={`app theme-${theme}`}>
      <header>
        <ThemeSwitcher currentTheme={theme} onThemeChange={handleThemeChange} />
      </header>
      
      {/* Your routes */}
    </div>
  );
}
```

### Step 4: Add Routes

Add these routes to your router:

```typescript
import AnimeBrowse from './pages/AnimeBrowse';
import DonghuaBrowse from './pages/DonghuaBrowse';
import WatchPage from './pages/WatchPage';
import WatchlistPage from './pages/WatchlistPage';

<Routes>
  <Route path="/anime" element={<AnimeBrowse />} />
  <Route path="/donghua" element={<DonghuaBrowse />} />
  <Route path="/watch/:slug" element={<WatchPage />} />
  <Route path="/watchlist" element={<WatchlistPage />} />
</Routes>
```

### Step 5: Test Locally

```bash
npm run dev
```

Visit:
- http://localhost:5173/anime - Browse anime
- http://localhost:5173/donghua - Browse donghua
- http://localhost:5173/watchlist - Your watchlist

### Step 6: Deploy

```bash
git add .
git commit -m "Frontend ready with backend integration"
git push origin main
```

---

## 🏛️ Backend Services

### Episode API
`https://runtime.codewords.ai/anicrew_episode_api_935ba891`
- Episodes, Search, Watchlist

### Advanced API  
`https://runtime.codewords.ai/anicrew_advanced_api_4dba6ed6`
- Google OAuth, Comments, Premium/Stripe

### Scraper
`https://runtime.codewords.ai/anicrew_scraper_9b4a4df7`
- Auto-runs daily at 12 PM IST

---

## 🎮 Features Ready

✅ Anime browse with filters (Hindi, English, Multi-audio)
✅ Donghua browse (Chinese anime)
✅ Video streaming (StreamTape)
✅ Google OAuth login
✅ Comments system
✅ Watchlist with share links
✅ Theme animations (Space Odyssey, Solar Flare, Ghibli)
✅ Daily auto-scraping (6 sources)
✅ Premium subscription (Stripe ready)

---

## 🔑 Configuration

### Google OAuth (Already configured)
- Client ID: `258877510838-v47hc4c9h3p0ggk3d1p2cgt600po7g65.apps.googleusercontent.com`
- Authorized origin: `https://AniCrew.online`

### Stripe (Optional - for premium)
Add your Stripe key via: https://dashboard.stripe.com/apikeys

---

## 🎨 How Themes Work

1. **ThemeSwitcher** component shows 4 theme buttons
2. Clicking a theme saves to `localStorage`
3. `App.tsx` applies `theme-{name}` className to root div
4. `themes.css` has animations for each theme

**Available Themes:**
- 🌙 Default
- 🚀 Space Odyssey (floating particles)
- ☀️ Solar Flare (glowing effects)
- 🌸 Studio Ghibli (dreamy filters)

---

## 👥 User Roles

- **Owner:** landlassan5@gmail.com (full access)
- **Admin:** Can manage content and view stats
- **User:** Can watch, comment, and create watchlist

---

## 🛠️ Troubleshooting

### Themes not working?
1. Check `import './styles/themes.css'` in App.tsx
2. Verify `className={`app theme-${theme}`}` is applied
3. Clear browser cache (Ctrl+Shift+R)

### No episodes showing?
1. Run first scrape: https://codewords.agemo.ai/run/anicrew_scheduler_08ee1cbd
2. Wait 2-3 minutes for data to populate
3. Refresh your page

### Login not working?
1. Check Google OAuth Client ID in GoogleLogin.tsx
2. Verify domain authorized in Google Console
3. Check browser console for errors

---

## 📧 Need Help?

Backend issues? Contact via CodeWords: https://codewords.agemo.ai

---

**🎉 Your anime streaming platform is ready!**