import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

interface PasswordProtectionProps {
  children: React.ReactNode;
  correctPassword: string;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ children, correctPassword }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  // Проверяем сохраненный токен при загрузке
  useEffect(() => {
    const savedToken = localStorage.getItem('dashboard_auth');
    if (savedToken === correctPassword) {
      setIsAuthenticated(true);
    }
  }, [correctPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('dashboard_auth', password);
      setError('');
    } else {
      setError('Неверный пароль');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 p-8 sm:p-12">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-brand" />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-100 mb-2">
            Защищенный доступ
          </h1>
          <p className="text-sm text-slate-400 text-center mb-8">
            Введите пароль для доступа к дашборду
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
                autoFocus
              />
              {error && (
                <p className="text-rose-400 text-sm mt-2 flex items-center gap-2">
                  <span className="w-1 h-1 bg-rose-400 rounded-full"></span>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand hover:bg-brand-600 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-brand/20"
            >
              Войти
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-6">
            Ваш пароль сохраняется локально в браузере
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordProtection;
