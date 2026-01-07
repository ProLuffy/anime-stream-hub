// Google OAuth Login Component
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin as GoogleBtn } from '@react-oauth/google';
import { api } from '../utils/api';

interface GoogleLoginProps {
  onLoginSuccess?: (result: any) => void;
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ onLoginSuccess }) => {
  const handleSuccess = async (credentialResponse: any) => {
    try {
      const result = await api.googleLogin(credentialResponse.credential);
      
      localStorage.setItem('anicrew_user', JSON.stringify(result.user));
      localStorage.setItem('anicrew_token', result.access_token);
      localStorage.setItem('anicrew_role', result.role);
      
      if (onLoginSuccess) onLoginSuccess(result);
      
      alert(`Welcome ${result.user.name}! Role: ${result.role}`);
      window.location.href = '/';
      
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed');
    }
  };

  return (
    <GoogleOAuthProvider clientId="258877510838-v47hc4c9h3p0ggk3d1p2cgt600po7g65.apps.googleusercontent.com">
      <GoogleBtn
        onSuccess={handleSuccess}
        onError={() => alert('Login failed')}
        theme="filled_blue"
        size="large"
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLogin;