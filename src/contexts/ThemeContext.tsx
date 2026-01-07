import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Theme {
  id: string;
  name: string;
  category: 'light' | 'dark' | 'special';
  previewColor: string;
}

export const themes: Theme[] = [
  // Light Themes
  { id: 'root', name: 'Moonlight', category: 'light', previewColor: '#f8f9fa' },
  { id: 'sakura-snow', name: 'Sakura Snow', category: 'light', previewColor: '#fff0f5' },
  { id: 'cloud-white', name: 'Cloud White', category: 'light', previewColor: '#f0f8ff' },
  { id: 'ivory-sky', name: 'Ivory Sky', category: 'light', previewColor: '#fffff0' },
  { id: 'soft-pastel', name: 'Soft Pastel', category: 'light', previewColor: '#faf0e6' },
  { id: 'vanilla-cream', name: 'Vanilla Cream', category: 'light', previewColor: '#fdf5e6' },
  { id: 'morning-bloom', name: 'Morning Bloom', category: 'light', previewColor: '#f0fff0' },
  { id: 'paper-white', name: 'Paper White', category: 'light', previewColor: '#fefefe' },
  { id: 'sunrise-tokyo', name: 'Sunrise Tokyo', category: 'light', previewColor: '#fff5ee' },
  { id: 'light-otaku', name: 'Light Otaku', category: 'light', previewColor: '#f5f5f5' },
  { id: 'peach-blossom', name: 'Peach Blossom', category: 'light', previewColor: '#ffe4e1' },
  { id: 'cotton-candy', name: 'Cotton Candy', category: 'light', previewColor: '#ffe4f0' },
  
  // Dark Themes
  { id: 'midnight-sakura', name: 'Midnight Sakura', category: 'dark', previewColor: '#1a1625' },
  { id: 'obsidian-night', name: 'Obsidian Night', category: 'dark', previewColor: '#0d1117' },
  { id: 'phantom-black', name: 'Phantom Black', category: 'dark', previewColor: '#0a0a0a' },
  { id: 'neon-tokyo', name: 'Neon Tokyo', category: 'dark', previewColor: '#120a1a' },
  { id: 'crimson-void', name: 'Crimson Void', category: 'dark', previewColor: '#1a0a0a' },
  { id: 'dark-otaku', name: 'Dark Otaku', category: 'dark', previewColor: '#151515' },
  { id: 'cyber-shinobi', name: 'Cyber Shinobi', category: 'dark', previewColor: '#0a1520' },
  { id: 'shadow-realm', name: 'Shadow Realm', category: 'dark', previewColor: '#0d0d15' },
  { id: 'eclipse-blue', name: 'Eclipse Blue', category: 'dark', previewColor: '#0a0f1a' },
  { id: 'oni-darkness', name: 'Oni Darkness', category: 'dark', previewColor: '#150a10' },
  { id: 'void-purple', name: 'Void Purple', category: 'dark', previewColor: '#100a15' },
  { id: 'noir-anime', name: 'Noir Anime', category: 'dark', previewColor: '#121212' },
  
  // Special Animated Themes
  { id: 'solar-flare', name: 'Solar Flare', category: 'special', previewColor: '#ff6b35' },
  { id: 'vaporwave-neon', name: 'Vaporwave Neon', category: 'special', previewColor: '#ff00ff' },
  { id: 'retro-anime', name: 'Retro Anime', category: 'special', previewColor: '#e6b800' },
  { id: 'glassmorphism', name: 'Glassmorphism', category: 'special', previewColor: '#88c0d0' },
  { id: 'studio-ghibli', name: 'Studio Ghibli', category: 'special', previewColor: '#7cb342' },
  { id: 'monochrome-pro', name: 'Monochrome Pro', category: 'special', previewColor: '#808080' },
  { id: 'space-odyssey', name: 'Space Odyssey', category: 'special', previewColor: '#1a0033' },
  { id: 'lunar-eclipse', name: 'Lunar Eclipse', category: 'special', previewColor: '#2c1654' },
  { id: 'akatsuki-night', name: 'Akatsuki Night', category: 'special', previewColor: '#8b0000' },
  { id: 'zen-black', name: 'Zen Black', category: 'special', previewColor: '#1a1a1a' },
  { id: 'misty-midnight', name: 'Misty Midnight', category: 'special', previewColor: '#2f4f4f' },
  { id: 'nebula-nights', name: 'Nebula Nights', category: 'special', previewColor: '#4a0080' },
];

// Quick access: 3 light, 3 dark for variety
export const quickAccessThemes = [
  themes.find(t => t.id === 'root')!, // Moonlight (light)
  themes.find(t => t.id === 'midnight-sakura')!, // Midnight Sakura (dark)
  themes.find(t => t.id === 'sakura-snow')!, // Sakura Snow (light)
  themes.find(t => t.id === 'neon-tokyo')!, // Neon Tokyo (dark)
  themes.find(t => t.id === 'cloud-white')!, // Cloud White (light)
  themes.find(t => t.id === 'obsidian-night')!, // Obsidian Night (dark)
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  allThemes: Theme[];
  quickThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('anicrew-theme');
      if (saved) {
        const found = themes.find(t => t.id === saved);
        if (found) return found;
      }
    }
    // Default to Moonlight (light theme) for clean look
    return themes[0];
  });

  // Apply theme on mount and change
  useEffect(() => {
    const applyTheme = () => {
      localStorage.setItem('anicrew-theme', currentTheme.id);
      
      // Remove all theme classes
      const classes = Array.from(document.documentElement.classList);
      classes.forEach(cls => {
        if (cls.startsWith('theme-')) {
          document.documentElement.classList.remove(cls);
        }
      });
      
      // Add current theme class if not root
      if (currentTheme.id !== 'root') {
        document.documentElement.classList.add(`theme-${currentTheme.id}`);
      }
    };
    
    applyTheme();
  }, [currentTheme]);

  const setTheme = (theme: Theme) => {
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
