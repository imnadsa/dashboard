import React from 'react';
import { useAuth } from './hooks/useAuth';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const { isAuthenticated, isLoading, clientName, csvUrl, error, login, logout } = useAuth();

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} isLoading={isLoading} error={error} />;
  }

  // Show dashboard
  return (
    <Dashboard
      clientName={clientName || 'Dashboard'}
      csvUrl={csvUrl || ''}
      onLogout={logout}
    />
  );
};

export default App;
