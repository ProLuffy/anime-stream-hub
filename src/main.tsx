import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx'
import './index.css'

const GOOGLE_CLIENT_ID = '258877510838-v47hc4c9h3p0ggk3d1p2cgt600po7g65.apps.googleusercontent.com';

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);