import React from 'react';
import { Moon, Sun, ChevronDown, LogOut } from 'lucide-react';

interface HeaderProps {
  clientName: string;
  selectedMonth: string;
  months: string[];
  onMonthChange: (month: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  lastUpdated: Date | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  clientName,
  selectedMonth,
  months,
  onMonthChange,
  isDark,
  onThemeToggle,
  lastUpdated,
  onLogout,
}) => {
  return (
    <header className={`glass border-b sticky top-0 z-50 transition-all ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h1 className={`text-[14px] sm:text-base font-extrabold tracking-tight uppercase leading-none ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              {clientName}
            </h1>
            <p className="text-[9px] sm:text-[11px] font-semibold mt-0.5 uppercase tracking-[0.25em] text-brand/70">
              Дашборд
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className={`p-2 rounded-xl transition-all active:scale-95 ${
              isDark 
                ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Month Selector */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className={`pl-3 pr-8 py-2 border rounded-xl text-[11px] sm:text-[12px] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-brand/20 cursor-pointer transition-all min-w-[100px] sm:min-w-[130px] ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-slate-300' 
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              {months.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Updated Time */}
          {lastUpdated && (
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wide">
                Обновлено
              </span>
              <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}

          {/* Logout */}
          
        </div>
      </div>
    </header>
  );
};

export default Header;
