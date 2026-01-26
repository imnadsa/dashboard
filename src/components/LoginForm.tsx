import React, { useState } from 'react';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onLogin: (slug: string, password: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading, error }) => {
  const [password, setPassword] = useState('');
  const slug = import.meta.env.VITE_DEFAULT_SLUG || 'snegirev';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(slug, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-brand/20 rounded-full blur-[100px] -top-48 -left-48" />
        <div className="absolute w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] -bottom-32 -right-32" />
        <div className="absolute w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-card rounded-3xl p-8 sm:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand to-brand-700 flex items-center justify-center shadow-lg shadow-brand/30">
              <Lock className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-2">
            Добро пожаловать на платформу "Сколько Денег"
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-8">
            Введите пароль для доступа к дашборду
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                className="w-full px-5 py-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all text-center text-lg tracking-widest"
                autoFocus
                disabled={isLoading}
              />
              {error && (
                <p className="text-rose-500 text-sm mt-3 text-center flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-4 bg-gradient-to-r from-brand to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-brand/20 disabled:shadow-none flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Проверка...
                </>
              ) : (
                <>
                  Войти
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-6">
          Сессия сохраняется в браузере
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
