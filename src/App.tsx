import React from 'react';
import { RitualistOracle } from './components/RitualistOracle';
import { Terminal, ArrowUpRight } from 'lucide-react';

const DEFAULT_USER_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

function App() {
  // Load or set default API key
  const [apiKey, setApiKeyState] = React.useState<string>(() => {
    const cached = localStorage.getItem('RITUAL_GROQ_KEY');
    if (cached) return cached;
    // Set user-provided default key so it works out-of-the-box
    localStorage.setItem('RITUAL_GROQ_KEY', DEFAULT_USER_KEY);
    return DEFAULT_USER_KEY;
  });

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('RITUAL_GROQ_KEY', key);
  };

  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);

  return (
    <div className="app-container">
      <div className="glow-overlay" />

      {/* Main Header */}
      <header className="app-header">
        <a href="https://ritual.net" target="_blank" rel="noreferrer" className="brand-section">
          <div className="brand-logo">
            <span className="brand-logo-inner">R</span>
          </div>
          <h1 className="brand-title">RITUAL NET</h1>
          <span className="brand-badge">Autonomous AI</span>
        </a>

        <div className="header-controls">
          <div className="groq-connection-badge">
            <div className={`groq-connection-dot ${apiKey.trim().startsWith('gsk_') ? 'dot-connected' : 'dot-sandbox'}`} />
            <span>
              {apiKey.trim().startsWith('gsk_') ? 'Groq Active' : 'Sandbox Fallback'}
            </span>
          </div>
          <button 
            className="btn-config"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Terminal size={14} />
            Config API
          </button>
        </div>
      </header>

      {/* Fullscreen Chat Only Layout */}
      <main className="chatbot-only-layout">
        <RitualistOracle 
          onSendMessage={() => {}}
          apiKey={apiKey}
          setApiKey={setApiKey}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1.25rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        background: 'rgba(4, 5, 10, 0.4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        marginTop: 'auto'
      }}>
        <div>
          © 2026 Ritual Network. Built with Groq & React.
        </div>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <a href="https://ritual.net" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            Official Web <ArrowUpRight size={12} />
          </a>
          <a href="https://docs.ritual.net" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            Infernet Docs <ArrowUpRight size={12} />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
