import React, { useState } from 'react';
import { Search, User, Bell, Menu, X, Settings, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme, quickAccessThemes } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentTheme, setTheme, quickThemes } = useTheme();

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">A</span>
            </div>
            <span className="font-display text-xl font-bold gradient-text hidden sm:block">
              AniCrew
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Home
            </Link>
            <Link to="/anime" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Anime
            </Link>
            <Link to="/donghua" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Donghua
            </Link>
            <Link to="/watchlist" className="text-foreground/80 hover:text-foreground transition-colors font-medium">
              Watchlist
            </Link>
          </div>

          {/* Search Bar */}
          <div className={`${isSearchOpen ? 'flex' : 'hidden'} md:flex items-center flex-1 max-w-md mx-4`}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search anime, donghua..."
                className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Quick Theme Selector */}
            <div className="hidden lg:flex items-center gap-1 px-2">
              {quickThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme)}
                  className={`theme-selector-btn ${currentTheme.id === theme.id ? 'active' : ''}`}
                  style={{ backgroundColor: theme.previewColor }}
                  title={theme.name}
                />
              ))}
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">Guest User</p>
                  <p className="text-xs text-muted-foreground">Sign in to save progress</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Crown className="w-4 h-4 mr-2" />
                  <span className="gradient-text font-medium">Go Premium</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign In</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-up">
            <div className="flex flex-col gap-2">
              <Link to="/" className="px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors">
                Home
              </Link>
              <Link to="/anime" className="px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors">
                Anime
              </Link>
              <Link to="/donghua" className="px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors">
                Donghua
              </Link>
              <Link to="/watchlist" className="px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors">
                Watchlist
              </Link>
            </div>
            
            {/* Mobile Theme Selector */}
            <div className="flex items-center gap-2 px-4 py-3 mt-2">
              <span className="text-sm text-muted-foreground">Theme:</span>
              <div className="flex gap-1">
                {quickThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setTheme(theme)}
                    className={`theme-selector-btn ${currentTheme.id === theme.id ? 'active' : ''}`}
                    style={{ backgroundColor: theme.previewColor }}
                    title={theme.name}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
