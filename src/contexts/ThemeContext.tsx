import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Theme {
  id: string;
  name: string;
  category: 'light' | 'dark' | 'special';
  previewColor: string;
  icon: string;
}

export const themes: Theme[] = [
  // Light Themes
  { id: 'root', name: 'Moonlight', category: 'light', previewColor: '#f8f9fa', icon: '🌙' },
  { id: 'sakura-snow', name: 'Sakura Snow', category: 'light', previewColor: '#fff0f5', icon: '🌸' },
  { id: 'cloud-white', name: 'Cloud White', category: 'light', previewColor: '#f0f8ff', icon: '☁️' },
  { id: 'ivory-sky', name: 'Ivory Sky', category: 'light', previewColor: '#fffff0', icon: '🌤️' },
  { id: 'soft-pastel', name: 'Soft Pastel', category: 'light', previewColor: '#faf0e6', icon: '🎨' },
  { id: 'vanilla-cream', name: 'Vanilla Cream', category: 'light', previewColor: '#fdf5e6', icon: '🍦' },
  { id: 'morning-bloom', name: 'Morning Bloom', category: 'light', previewColor: '#f0fff0', icon: '🌷' },
  { id: 'paper-white', name: 'Paper White', category: 'light', previewColor: '#fefefe', icon: '📄' },
  { id: 'sunrise-tokyo', name: 'Sunrise Tokyo', category: 'light', previewColor: '#fff5ee', icon: '🌅' },
  { id: 'light-otaku', name: 'Light Otaku', category: 'light', previewColor: '#f5f5f5', icon: '✨' },
  { id: 'peach-blossom', name: 'Peach Blossom', category: 'light', previewColor: '#ffe4e1', icon: '🍑' },
  { id: 'cotton-candy', name: 'Cotton Candy', category: 'light', previewColor: '#ffe4f0', icon: '🍭' },
  
  // Dark Themes
  { id: 'midnight-sakura', name: 'Midnight Sakura', category: 'dark', previewColor: '#1a1625', icon: '🌺' },
  { id: 'obsidian-night', name: 'Obsidian Night', category: 'dark', previewColor: '#0d1117', icon: '🖤' },
  { id: 'phantom-black', name: 'Phantom Black', category: 'dark', previewColor: '#0a0a0a', icon: '👻' },
  { id: 'neon-tokyo', name: 'Neon Tokyo', category: 'dark', previewColor: '#120a1a', icon: '🌆' },
  { id: 'crimson-void', name: 'Crimson Void', category: 'dark', previewColor: '#1a0a0a', icon: '🔴' },
  { id: 'dark-otaku', name: 'Dark Otaku', category: 'dark', previewColor: '#151515', icon: '🎭' },
  { id: 'cyber-shinobi', name: 'Cyber Shinobi', category: 'dark', previewColor: '#0a1520', icon: '🥷' },
  { id: 'shadow-realm', name: 'Shadow Realm', category: 'dark', previewColor: '#0d0d15', icon: '🌑' },
  { id: 'eclipse-blue', name: 'Eclipse Blue', category: 'dark', previewColor: '#0a0f1a', icon: '🌘' },
  { id: 'oni-darkness', name: 'Oni Darkness', category: 'dark', previewColor: '#150a10', icon: '👹' },
  { id: 'void-purple', name: 'Void Purple', category: 'dark', previewColor: '#100a15', icon: '💜' },
  { id: 'noir-anime', name: 'Noir Anime', category: 'dark', previewColor: '#121212', icon: '🎬' },
  
  // Special Animated Themes
  { id: 'solar-flare', name: 'Solar Flare', category: 'special', previewColor: '#ff6b35', icon: '☀️' },
  { id: 'vaporwave-neon', name: 'Vaporwave Neon', category: 'special', previewColor: '#ff00ff', icon: '🌈' },
  { id: 'retro-anime', name: 'Retro Anime', category: 'special', previewColor: '#e6b800', icon: '📺' },
  { id: 'glassmorphism', name: 'Glassmorphism', category: 'special', previewColor: '#88c0d0', icon: '🪟' },
  { id: 'ghibli', name: 'Studio Ghibli', category: 'special', previewColor: '#7cb342', icon: '🍃' },
  { id: 'monochrome-pro', name: 'Monochrome Pro', category: 'special', previewColor: '#808080', icon: '⚪' },
  { id: 'space-odyssey', name: 'Space Odyssey', category: 'special', previewColor: '#1a0033', icon: '🚀' },
  { id: 'lunar-eclipse', name: 'Lunar Eclipse', category: 'special', previewColor: '#2c1654', icon: '🌓' },
  { id: 'akatsuki-night', name: 'Akatsuki Night', category: 'special', previewColor: '#8b0000', icon: '☁️' },
  { id: 'zen-black', name: 'Zen Black', category: 'special', previewColor: '#1a1a1a', icon: '☯️' },
  { id: 'misty-midnight', name: 'Misty Midnight', category: 'special', previewColor: '#2f4f4f', icon: '🌫️' },
  { id: 'nebula-nights', name: 'Nebula Nights', category: 'special', previewColor: '#4a0080', icon: '🌌' },
];

// Quick access: 6 themes (2 light, 2 dark, 2 special)
export const quickAccessThemes = [
  themes.find(t => t.id === 'root')!,
  themes.find(t => t.id === 'midnight-sakura')!,
  themes.find(t => t.id === 'sakura-snow')!,
  themes.find(t => t.id === 'neon-tokyo')!,
  themes.find(t => t.id === 'space-odyssey')!,
  themes.find(t => t.id === 'ghibli')!,
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  allThemes: Theme[];
  quickThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Apply theme immediately to prevent flash
const applyThemeToDOM = (themeId: string, category: 'light' | 'dark' | 'special') => {
  const root = document.documentElement;
  const body = document.body;
  
  // Get all theme classes to remove
  const allThemeClasses = themes.map(t => `theme-${t.id}`);
  
  // Remove all theme classes
  allThemeClasses.forEach(cls => {
    root.classList.remove(cls);
    body.classList.remove(cls);
  });
  
  // Add new theme class if not default
  if (themeId !== 'root') {
    const themeClass = `theme-${themeId}`;
    root.classList.add(themeClass);
    body.classList.add(themeClass);
  }
  
  // Set color scheme for proper scrollbar colors etc
  const colorScheme = category === 'light' ? 'light' : 'dark';
  root.style.colorScheme = colorScheme;
  
  // Set data attribute for additional CSS targeting
  root.setAttribute('data-theme', themeId);
  body.setAttribute('data-theme', themeId);
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('anicrew-theme');
      if (saved) {
        const found = themes.find(t => t.id === saved);
        if (found) {
          // Apply immediately on load
          applyThemeToDOM(found.id, found.category);
          return found;
        }
      }
    }
    return themes[0]; // Default to Moonlight
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('anicrew-theme', currentTheme.id);
    
    // Apply theme to DOM
    applyThemeToDOM(currentTheme.id, currentTheme.category);
    
    console.log('Theme applied:', currentTheme.id);
  }, [currentTheme]);

  const setTheme = (theme: Theme) => {
    // Apply immediately for instant feedback
    applyThemeToDOM(theme.id, theme.category);
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      setTheme, 
      allThemes: themes,
      quickThemes: quickAccessThemes 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
