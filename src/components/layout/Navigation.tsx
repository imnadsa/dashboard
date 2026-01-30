import React from 'react';
import { BarChart3, Calculator } from 'lucide-react';

interface NavigationProps {
  currentTab: 'dashboard' | 'calculator';
  onTabChange: (tab: 'dashboard' | 'calculator') => void;
  isDark: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange, isDark }) => {
  return (
    <div className={`border-b ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white/50'} backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1 py-3">
          {/* Дашборд */}
          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              currentTab === 'dashboard'
                ? 'bg-brand text-white shadow-lg shadow-brand/20'
                : isDark
                  ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 size={18} />
            <span>Дашборд</span>
          </button>

          {/* Калькулятор маржи */}
          <button
            onClick={() => onTabChange('calculator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              currentTab === 'calculator'
                ? 'bg-brand text-white shadow-lg shadow-brand/20'
                : isDark
                  ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calculator size={18} />
            <span>Калькулятор маржи</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
