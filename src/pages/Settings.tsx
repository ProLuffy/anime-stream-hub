import React, { useState } from 'react';
import { User, Palette, Bell, Shield, Globe, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTheme, themes, Theme } from '@/contexts/ThemeContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useWatchProgress } from '@/hooks/useWatchProgress';
import { useSearch } from '@/hooks/useSearch';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { currentTheme, setTheme, allThemes } = useTheme();
  const { profile, updateProfile, resetProfile } = useUserProfile();
  const { clearProgress } = useWatchProgress();
  const { clearWatchHistory } = useSearch();
  
  const [username, setUsername] = useState(profile.username);

  const lightThemes = allThemes.filter(t => t.category === 'light');
  const darkThemes = allThemes.filter(t => t.category === 'dark');
  const specialThemes = allThemes.filter(t => t.category === 'special');

  const handleSaveProfile = () => {
    updateProfile({ username });
    toast.success('Profile updated successfully!');
  };

  const handleClearData = () => {
    clearProgress();
    clearWatchHistory();
    toast.success('Watch history and progress cleared!');
  };

  const handleResetAll = () => {
    resetProfile();
    clearProgress();
    clearWatchHistory();
    setTheme(themes[0]);
    toast.success('All settings reset to default!');
  };

  const ThemeGrid: React.FC<{ themeList: Theme[]; title: string }> = ({ themeList, title }) => (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-muted-foreground">{title}</h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {themeList.map((theme) => (
          <button
            key={theme.id}
            onClick={() => {
              setTheme(theme);
              toast.success(`Theme changed to ${theme.name}`);
            }}
            className={`relative p-3 rounded-xl border-2 transition-all hover:scale-105 ${
              currentTheme.id === theme.id
                ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div
              className="w-full aspect-square rounded-lg mb-2"
              style={{ backgroundColor: theme.previewColor }}
            />
            <p className="text-xs font-medium truncate">{theme.name}</p>
            {currentTheme.id === theme.id && (
              <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="themes" className="gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Themes</span>
            </TabsTrigger>
            <TabsTrigger value="playback" className="gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Playback</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Premium Status</Label>
                    <p className="text-sm text-muted-foreground">
                      {profile.isPremium ? 'You have premium access' : 'Upgrade to download content'}
                    </p>
                  </div>
                  <Button variant={profile.isPremium ? 'secondary' : 'default'}>
                    {profile.isPremium ? 'Premium Active' : 'Upgrade to Premium'}
                  </Button>
                </div>

                <Button onClick={handleSaveProfile} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Themes Tab */}
          <TabsContent value="themes">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>
                  Choose from 36 beautiful themes - {lightThemes.length} light, {darkThemes.length} dark, and {specialThemes.length} special animated themes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="p-4 rounded-lg bg-secondary/30 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current Theme</p>
                    <p className="text-sm text-muted-foreground">{currentTheme.name}</p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-border"
                    style={{ backgroundColor: currentTheme.previewColor }}
                  />
                </div>

                <ThemeGrid themeList={lightThemes} title="🌙 Moonlight Themes (Light)" />
                <ThemeGrid themeList={darkThemes} title="🌑 Dark Themes (Anime Focused)" />
                <ThemeGrid themeList={specialThemes} title="✨ Special Animated Themes" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Playback Tab */}
          <TabsContent value="playback">
            <Card>
              <CardHeader>
                <CardTitle>Playback Settings</CardTitle>
                <CardDescription>Customize your viewing experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-play Next Episode</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically play the next episode when current one ends
                    </p>
                  </div>
                  <Switch
                    checked={profile.autoPlay}
                    onCheckedChange={(checked) => updateProfile({ autoPlay: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Subtitles by Default</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable subtitles when starting a video
                    </p>
                  </div>
                  <Switch
                    checked={profile.showSubtitles}
                    onCheckedChange={(checked) => updateProfile({ showSubtitles: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preferred Audio Language</Label>
                  <Select
                    value={profile.preferredLanguage}
                    onValueChange={(value) => updateProfile({ preferredLanguage: value })}
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Japanese">Japanese</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Subtitle Language</Label>
                  <Select
                    value={profile.subtitleLanguage}
                    onValueChange={(value) => updateProfile({ subtitleLanguage: value })}
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="off">Off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Data</CardTitle>
                <CardDescription>Manage your data and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <Label>Clear Watch History</Label>
                    <p className="text-sm text-muted-foreground">
                      Remove all watch history and progress data
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleClearData} className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Clear Data
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div>
                    <Label className="text-destructive">Reset All Settings</Label>
                    <p className="text-sm text-muted-foreground">
                      Reset all settings to default values
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleResetAll} className="gap-2">
                    <Trash2 className="w-4 h-4" />
                    Reset All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;
