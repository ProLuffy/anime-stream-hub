import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import AnimeDetail from "./pages/AnimeDetail";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// AniCrew Backend Integrated Pages
import AnimeBrowse from "./pages/AnimeBrowse";
import DonghuaBrowse from "./pages/DonghuaBrowse";
import WatchPage from "./pages/WatchPage";
import WatchlistPage from "./pages/WatchlistPage";
import ThemeSwitcher from "./components/ThemeSwitcher";
import GoogleLogin from "./components/GoogleLogin";

// Import theme CSS
import "./styles/themes.css";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [customTheme, setCustomTheme] = useState('default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('anicrew_theme');
    if (savedTheme) setCustomTheme(savedTheme);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setCustomTheme(newTheme);
    localStorage.setItem('anicrew_theme', newTheme);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className={`app theme-${customTheme}`}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            
            {/* Theme Switcher */}
            <div style={{ 
              position: 'fixed', 
              top: '10px', 
              right: '10px', 
              zIndex: 9999,
              background: 'rgba(255,255,255,0.9)',
              padding: '10px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <ThemeSwitcher currentTheme={customTheme} onThemeChange={handleThemeChange} />
            </div>

            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/anime/:id" element={<AnimeDetail />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* AniCrew Backend Routes */}
                <Route path="/browse/anime" element={<AnimeBrowse />} />
                <Route path="/browse/donghua" element={<DonghuaBrowse />} />
                <Route path="/watch/:slug" element={<WatchPage />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
                <Route path="/login" element={<LoginPage />} />
                
                <Route path="/watch/:animeId/:episodeId" element={<WatchPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const LoginPage = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '100vh',
    padding: '20px'
  }}>
    <h1 style={{ marginBottom: '30px' }}>Login to AniCrew</h1>
    <GoogleLogin onLoginSuccess={() => window.location.href = '/'} />
  </div>
);

export default App;