import { useState, useCallback, useEffect } from 'react';

export interface UserProfile {
  username: string;
  email?: string;
  avatar: string;
  isPremium: boolean;
  premiumPlan?: string;
  premiumExpiry?: string;
  isAdmin?: boolean;
  preferredLanguage: string;
  autoPlay: boolean;
  showSubtitles: boolean;
  subtitleLanguage: string;
}

const defaultProfile: UserProfile = {
  username: 'Guest User',
  email: '',
  avatar: '',
  isPremium: false,
  isAdmin: false,
  preferredLanguage: 'Japanese',
  autoPlay: true,
  showSubtitles: true,
  subtitleLanguage: 'English',
};

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('anicrew-user-profile');
      const storedUser = localStorage.getItem('anicrew_user');
      
      let baseProfile = saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
      
      // Merge with stored auth user if available
      if (storedUser) {
        const user = JSON.parse(storedUser);
        baseProfile = {
          ...baseProfile,
          username: user.username || baseProfile.username,
          email: user.email || baseProfile.email,
          avatar: user.avatar || baseProfile.avatar,
          isPremium: user.isPremium ?? baseProfile.isPremium,
          isAdmin: user.isAdmin ?? baseProfile.isAdmin,
        };
      }
      
      return baseProfile;
    }
    return defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem('anicrew-user-profile', JSON.stringify(profile));
    
    // Also sync to anicrew_user if it exists
    const storedUser = localStorage.getItem('anicrew_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      localStorage.setItem('anicrew_user', JSON.stringify({
        ...user,
        username: profile.username,
        avatar: profile.avatar,
        isPremium: profile.isPremium,
        isAdmin: profile.isAdmin,
      }));
    }
  }, [profile]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(defaultProfile);
    localStorage.removeItem('anicrew-user-profile');
  }, []);

  const setAvatar = useCallback((avatarDataUrl: string) => {
    setProfile(prev => ({ ...prev, avatar: avatarDataUrl }));
  }, []);

  return {
    profile,
    updateProfile,
    resetProfile,
    setAvatar,
  };
};
