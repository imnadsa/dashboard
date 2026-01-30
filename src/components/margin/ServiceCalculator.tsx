import React, { useState, useMemo } from 'react';
import { MarginService } from '../../types/margin';
import { calculateMargin, createGradientSegments, formatCurrency, formatPercent } from '../../lib/marginCalculations';
import MarginGradient from './MarginGradient';
import ExpenseBlock from './ExpenseBlock';
import NewPriceBlock from './NewPriceBlock';

interface ServiceCalculatorProps {
  service: MarginService;
  onUpdateService: (id: string, updates: Partial<MarginService>) => void;
  isDark: boolean;
}

const ServiceCalculator: React.FC<ServiceCalculatorProps> = ({
  service,
  onUpdateService,
  isDark,
}) => {
  const [desiredMarginPercent, setDesiredMarginPercent] = useState<number>(55);
  const [newPrice, setNewPrice] = useState<number>(0);

  // Рассчитываем все показатели
  const calculation = useMemo(() => {
    return calculateMargin(
      service.currentPrice,
      service.expenses,
      desiredMarginPercent,
      newPrice
    );
  }, [service.currentPrice, service.expenses, desiredMarginPercent, newPrice]);

  // Создаём сегменты для градиента
  const gradientSegments = useMemo(() => {
    return createGradientSegments(
      service.currentPrice,
      service.expenses,
      calculation.currentMarginPercent
    );
  }, [service.currentPrice, service.expenses, calculation.currentMarginPercent]);

  return (
    <div className="space-y-6">
      {/* Заголовок и текущая цена */}
      <div className={`rounded-2xl border p-6 ${
        isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Название услуги */}
          <div>
            <label className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Наименование услуги
            </label>
            <input
              type="text"
              value={service.name}
              onChange={(e) => onUpdateService(service.id, { name: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl text-lg font-bold ${
                isDark
                  ? 'bg-slate-700 text-slate-100 border-slate-600'
                  : 'bg-slate-50 text-slate-900 border-slate-300'
              } border focus:outline-none focus:ring-2 focus:ring-brand/30`}
              placeholder="Название услуги"
            />
          </div>

          {/* Текущая стоимость */}
          <div>
            <label className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Стоимость сейчас (₽)
            </label>
            <input
              type="number"
              value={service.currentPrice || ''}
              onChange={(e) => onUpdateService(service.id, { currentPrice: parseFloat(e.target.value) || 0 })}
              className={`w-full px-4 py-3 rounded-xl text-lg font-bold ${
                isDark
                  ? 'bg-slate-700 text-slate-100 border-slate-600'
                  : 'bg-slate-50 text-slate-900 border-slate-300'
              } border focus:outline-none focus:ring-2 focus:ring-brand/30`}
              placeholder="5500"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Текущая маржа */}
        {service.currentPrice > 0 && (
          <div className={`mt-6 p-4 rounded-xl ${
            isDark ? 'bg-slate-700/50' : 'bg-slate-100'
          }`}>
            <p className={`text-xs font-semibold mb-3 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              📊 Маржа сейчас:
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Прибыль в рублях */}
              <div>
                <p className={`text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Прибыль (руб):
                </p>
                <p className={`text-2xl font-black ${
                  calculation.currentProfit >= 0
                    ? isDark ? 'text-emerald-400' : 'text-emerald-600'
                    : 'text-rose-500'
                }`}>
                  {formatCurrency(calculation.currentProfit)} ₽
                </p>
              </div>

              {/* Маржа в процентах */}
              <div>
                <p className={`text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Маржа (%):
                </p>
                <p
                  className="text-2xl font-black"
                  style={{ 
                    color: calculation.currentMarginPercent >= 0 
                      ? (calculation.currentMarginPercent >= 50 
                          ? '#10b981' 
                          : calculation.currentMarginPercent >= 45 
                            ? '#fbbf24' 
                            : '#ef4444')
                      : '#ef4444'
                  }}
                >
                  {formatPercent(calculation.currentMarginPercent)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Градиентная шкала */}
      <MarginGradient segments={gradientSegments} isDark={isDark} />

      {/* Блок расходов */}
      <ExpenseBlock
        expenses={service.expenses}
        currentPrice={service.currentPrice}
        onUpdateExpenses={(expenses) => onUpdateService(service.id, { expenses })}
        isDark={isDark}
      />

      {/* Блок новой стоимости */}
      {service.currentPrice > 0 && (
        <NewPriceBlock
          totalExpenses={calculation.totalExpenses}
          recommendedPrice={calculation.recommendedPrice}
          newProfit={calculation.newProfit}
          newMarginPercent={calculation.newMarginPercent}
          onDesiredMarginChange={setDesiredMarginPercent}
          onNewPriceChange={setNewPrice}
          isDark={isDark}
        />
      )}
    </div>
  );
};

export default ServiceCalculator;
