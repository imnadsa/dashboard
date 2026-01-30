import React from 'react';
import { Calculator, BarChart3, Download } from 'lucide-react';

interface MarginHeaderProps {
  isDark: boolean;
  currentView: 'calculator' | 'summary';
  onViewChange: (view: 'calculator' | 'summary') => void;
  onExport: () => void;
  servicesCount: number;
}

const MarginHeader: React.FC<MarginHeaderProps> = ({
  isDark,
  currentView,
  onViewChange,
  onExport,
  servicesCount,
}) => {
  return (
    <div className={`mb-8 pb-6 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Левая часть - заголовок */}
        <div>
          <h1 className={`text-3xl font-black tracking-tight mb-2 ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Калькулятор маржи
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {servicesCount === 0 
              ? 'Создайте первую услугу для начала работы'
              : `${servicesCount} ${servicesCount === 1 ? 'услуга' : servicesCount < 5 ? 'услуги' : 'услуг'}`
            }
          </p>
        </div>

        {/* Правая часть - кнопки */}
        <div className="flex items-center gap-3">
          {/* Переключатель режимов */}
          <div className={`flex rounded-xl border ${
            isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <button
              onClick={() => onViewChange('calculator')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-l-xl font-semibold text-sm transition-all ${
                currentView === 'calculator'
                  ? 'bg-brand text-white shadow-lg shadow-brand/20'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calculator size={18} />
              <span className="hidden sm:inline">Калькулятор</span>
            </button>
            <button
              onClick={() => onViewChange('summary')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-r-xl font-semibold text-sm transition-all ${
                currentView === 'summary'
                  ? 'bg-brand text-white shadow-lg shadow-brand/20'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart3 size={18} />
              <span className="hidden sm:inline">Сводка</span>
            </button>
          </div>

          {/* Кнопка экспорта */}
          {servicesCount > 0 && (
            <button
              onClick={onExport}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isDark
                  ? 'bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700'
                  : 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Download size={18} />
              <span className="hidden sm:inline">Экспорт</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarginHeader;
