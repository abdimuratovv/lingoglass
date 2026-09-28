import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { ProfileProvider } from './context/ProfileContext.tsx';
import { SettingsProvider } from './context/SettingsContext.tsx';
import { XpStatsProvider } from './context/XpStatsContext.tsx';
import './index.css';

// XpStatsProvider SettingsProvider ichida bo'lishi shart — streak sozlamalardagi vaqt zonasida hisoblanadi.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <SettingsProvider>
            <XpStatsProvider>
              <App />
            </XpStatsProvider>
          </SettingsProvider>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
