import { useState, useCallback, useEffect } from 'react';

export interface UserProfile {
  username: string;
  avatar: string;
  isPremium: boolean;
  preferredLanguage: string;
  autoPlay: boolean;
  showSubtitles: boolean;
  subtitleLanguage: string;
}

const defaultProfile: UserProfile = {
  username: 'Guest User',
  avatar: '',
  isPremium: false,
  preferredLanguage: 'Japanese',
  autoPlay: true,
  showSubtitles: true,
  subtitleLanguage: 'English',
};

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('anicrew-user-profile');
      return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
    }
    return defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem('anicrew-user-profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(defaultProfile);
    localStorage.removeItem('anicrew-user-profile');
  }, []);

  return {
    profile,
    updateProfile,
    resetProfile,
  };
};
