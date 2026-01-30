import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import MarginCalculator from './pages/MarginCalculator';
import Navigation from './components/layout/Navigation';
import SvgGradients from './components/ui/SvgGradients';

type Tab = 'dashboard' | 'calculator';

const App: React.FC = () => {
  const { isAuthenticated, isLoading, clientName, csvUrl, error, login, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme ? savedTheme === 'dark' : true;
    }
    return true;
  });

  // Apply theme
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} isLoading={isLoading} error={error} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-[#0b0f19] text-slate-100' : 'bg-[#FBFBFE] text-slate-900'
    }`}>
      <SvgGradients />

      {/* Навигация (табы) */}
      <Navigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isDark={isDark}
      />

      {/* Контент в зависимости от выбранного таба */}
      {currentTab === 'dashboard' ? (
        <Dashboard
          clientName={clientName || 'Dashboard'}
          csvUrl={csvUrl || ''}
          onLogout={logout}
          isDark={isDark}
          onThemeToggle={() => setIsDark(!isDark)}
        />
      ) : (
        <MarginCalculator isDark={isDark} />
      )}
    </div>
  );
};

export default App;
