import React, { useState, useEffect } from 'react';
import { TrendingUp, Lightbulb } from 'lucide-react';
import { formatCurrency, formatPercent, getMarginColor } from '../../lib/marginCalculations';

interface NewPriceBlockProps {
  totalExpenses: number;
  recommendedPrice: number;
  newProfit: number;
  newMarginPercent: number;
  onDesiredMarginChange: (margin: number) => void;
  onNewPriceChange: (price: number) => void;
  isDark: boolean;
}

const NewPriceBlock: React.FC<NewPriceBlockProps> = ({
  totalExpenses,
  recommendedPrice,
  newProfit,
  newMarginPercent,
  onDesiredMarginChange,
  onNewPriceChange,
  isDark,
}) => {
  const [desiredMargin, setDesiredMargin] = useState<string>('55');
  const [newPrice, setNewPrice] = useState<string>('');

  // Обновляем desiredMargin при изменении
  const handleDesiredMarginChange = (value: string) => {
    setDesiredMargin(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      onDesiredMarginChange(numValue);
    }
  };

  // Обновляем newPrice при изменении
  const handleNewPriceChange = (value: string) => {
    setNewPrice(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      onNewPriceChange(numValue);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Блок "Хочу маржу" */}
      <div className={`rounded-2xl border p-6 ${
        isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-emerald-500" />
          <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Целевая маржа
          </h3>
        </div>

        <div className="space-y-4">
          {/* Ввод желаемой маржи */}
          <div>
            <label className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Хочу маржу (%)
            </label>
            <input
              type="number"
              value={desiredMargin}
              onChange={(e) => handleDesiredMarginChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl text-lg font-bold ${
                isDark
                  ? 'bg-slate-700 text-slate-100 border-slate-600'
                  : 'bg-slate-50 text-slate-900 border-slate-300'
              } border focus:outline-none focus:ring-2 focus:ring-emerald-500/30`}
              placeholder="55"
              min="0"
              max="100"
              step="0.1"
            />
          </div>

          {/* Рекомендуемая цена */}
          {recommendedPrice > 0 && (
            <div className={`p-4 rounded-xl border-2 ${
              isDark
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-emerald-50 border-emerald-200'
            }`}>
              <div className="flex items-start gap-3">
                <Lightbulb size={20} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold mb-2 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-700'
                  }`}>
                    💡 Рекомендуемая стоимость:
                  </p>
                  <p className={`text-2xl font-black ${
                    isDark ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>
                    {formatCurrency(recommendedPrice)} ₽
                  </p>
                  <p className={`text-[10px] mt-1 ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    Установите эту цену для достижения целевой маржи
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Блок "Новая стоимость" */}
      <div className={`rounded-2xl border p-6 ${
        isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-brand" />
          <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Новая стоимость
          </h3>
        </div>

        <div className="space-y-4">
          {/* Ввод новой стоимости */}
          <div>
            <label className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Стоимость услуги (₽)
            </label>
            <input
              type="number"
              value={newPrice}
              onChange={(e) => handleNewPriceChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl text-lg font-bold ${
                isDark
                  ? 'bg-slate-700 text-slate-100 border-slate-600'
                  : 'bg-slate-50 text-slate-900 border-slate-300'
              } border focus:outline-none focus:ring-2 focus:ring-brand/30`}
              placeholder="8000"
              min="0"
              step="0.01"
            />
          </div>

          {/* Результат: новая маржа */}
          {newPrice && parseFloat(newPrice) > 0 && (
            <div className={`p-4 rounded-xl ${
              isDark ? 'bg-slate-700/50' : 'bg-slate-100'
            }`}>
              <p className={`text-xs font-semibold mb-2 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Результат:
              </p>
              
              {/* Прибыль */}
              <div className="flex items-baseline justify-between mb-2">
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Маржа (руб):
                </span>
                <span className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {formatCurrency(newProfit)} ₽
                </span>
              </div>

              {/* Процент маржи */}
              <div className="flex items-baseline justify-between">
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Маржа (%):
                </span>
                <span
                  className="text-xl font-bold"
                  style={{ color: getMarginColor(newMarginPercent) }}
                >
                  {formatPercent(newMarginPercent)}%
                </span>
              </div>

              {/* Индикатор качества маржи */}
              <div className="mt-3 pt-3 border-t border-slate-600/30">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getMarginColor(newMarginPercent) }}
                  />
                  <span className={`text-xs font-medium ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {newMarginPercent >= 50
                      ? '✅ Отличная маржа'
                      : newMarginPercent >= 45
                        ? '⚠️ Приемлемая маржа'
                        : '❌ Низкая маржа'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPriceBlock;
