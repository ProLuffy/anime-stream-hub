import React, { useState, useEffect } from 'react';
import { Search, User, Bell, Menu, X, Settings, Crown, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import SearchOverlay from '@/components/search/SearchOverlay';
import { toast } from 'sonner';

interface StoredUser {
  email: string;
  username: string;
  avatar?: string;
  isPremium: boolean;
  isAdmin?: boolean;
}

const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const { currentTheme, setTheme, quickThemes } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('anicrew_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('anicrew_user');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

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

          {/* Search Button */}
          <Button
            variant="ghost"
            className="hidden md:flex items-center gap-2 px-4 text-muted-foreground hover:text-foreground"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-4 h-4" />
            <span>Search anime...</span>
          </Button>

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

            {/* Premium Button */}
            {!user?.isPremium && (
              <Link to="/premium" className="hidden sm:block">
                <Button variant="outline" size="sm" className="gap-1 border-amber-500/50 text-amber-500 hover:bg-amber-500/10">
                  <Crown className="w-4 h-4" />
                  Premium
                </Button>
              </Link>
            )}

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  {user ? (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      {user.isPremium && (
                        <span className="inline-flex items-center gap-1 mt-1 text-xs text-amber-500">
                          <Crown className="w-3 h-3" /> Premium Member
                        </span>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="w-full cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {!user.isPremium && (
                      <DropdownMenuItem asChild>
                        <Link to="/premium" className="w-full cursor-pointer">
                          <Crown className="w-4 h-4 mr-2 text-amber-500" />
                          <span className="gradient-text font-medium">Go Premium</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="w-full cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="w-full cursor-pointer">
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">Guest User</p>
                      <p className="text-xs text-muted-foreground">Sign in to save progress</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/premium" className="w-full cursor-pointer">
                        <Crown className="w-4 h-4 mr-2 text-amber-500" />
                        <span className="gradient-text font-medium">Go Premium</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="w-full cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/auth" className="w-full cursor-pointer font-medium">
                        Sign In
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
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

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
};

export default Navbar;
