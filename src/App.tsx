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
import AnimeBrowse from "./pages/AnimeBrowse";
import DonghuaBrowse from "./pages/DonghuaBrowse";
import WatchPage from "./pages/WatchPage";
import WatchlistPage from "./pages/WatchlistPage";
import AuthPage from "./pages/AuthPage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/anime" element={<AnimeBrowse />} />
              <Route path="/anime/:id" element={<AnimeDetail />} />
              <Route path="/donghua" element={<DonghuaBrowse />} />
              <Route path="/watch/:animeId/:episodeId" element={<WatchPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
