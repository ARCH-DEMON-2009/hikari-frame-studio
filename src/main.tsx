
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './index.css';

function DiwaliThemeLoader({ isDiwaliMode }: { isDiwaliMode: boolean }) {
  React.useEffect(() => {
    if (isDiwaliMode) {
      document.body.classList.add('diwali-mode');
      const script = document.createElement('script');
      script.src = '/diwali-theme/diwali-theme.js';
      script.defer = true;
      document.head.appendChild(script);
    } else {
      document.body.classList.remove('diwali-mode');
    }
  }, [isDiwaliMode]);
  return null;
}

function MainContent() {
  const { isAdmin } = useAuth();
  const [isDiwaliMode, setIsDiwaliMode] = React.useState(false);
  
  return (
    <>
      <DiwaliThemeLoader isDiwaliMode={isDiwaliMode} />
      {isAdmin && (
        <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 2000 }}>
          <label style={{ color: '#6a1b9a', fontWeight: 'bold', background: '#ffd700', padding: '0.5em 1em', borderRadius: '1em', boxShadow: '0 0 8px #ffd70088' }}>
            <input type="checkbox" checked={isDiwaliMode} onChange={e => setIsDiwaliMode(e.target.checked)} />
            {' '}Enable Diwali Theme
          </label>
        </div>
      )}
      <App />
    </>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <React.StrictMode>
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  </React.StrictMode>
);
