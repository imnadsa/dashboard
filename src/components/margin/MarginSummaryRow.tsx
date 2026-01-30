import React from 'react';
import { Edit2 } from 'lucide-react';
import { MarginService } from '../../types/margin';
import { calculateMargin, formatCurrency, formatPercent, getMarginColor } from '../../lib/marginCalculations';

interface MarginSummaryRowProps {
  service: MarginService;
  onEdit: (serviceId: string) => void;
  isDark: boolean;
}

const MarginSummaryRow: React.FC<MarginSummaryRowProps> = ({ service, onEdit, isDark }) => {
  const calculation = calculateMargin(service.currentPrice, service.expenses, 55);

  return (
    <tr className={`border-b transition-colors ${
      isDark 
        ? 'border-slate-700 hover:bg-slate-800/30' 
        : 'border-slate-200 hover:bg-slate-50'
    }`}>
      {/* Наименование */}
      <td className="py-4 px-4">
        <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          {service.name}
        </span>
      </td>

      {/* Текущая стоимость */}
      <td className="py-4 px-4">
        <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {formatCurrency(service.currentPrice)} ₽
        </span>
      </td>

      {/* Маржа (%) */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getMarginColor(calculation.currentMarginPercent) }}
          />
          <span
            className="font-bold text-lg"
            style={{ color: getMarginColor(calculation.currentMarginPercent) }}
          >
            {formatPercent(calculation.currentMarginPercent)}%
          </span>
        </div>
      </td>

      {/* Маржа (₽) */}
      <td className="py-4 px-4">
        <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {formatCurrency(calculation.currentProfit)} ₽
        </span>
      </td>

      {/* Рекомендуемая стоимость */}
      <td className="py-4 px-4">
        <span className={`font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
          {formatCurrency(calculation.recommendedPrice)} ₽
        </span>
      </td>

      {/* Действия */}
      <td className="py-4 px-4">
        <button
          onClick={() => onEdit(service.id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
            isDark
              ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
              : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
          }`}
        >
          <Edit2 size={14} />
          Редактировать
        </button>
      </td>
    </tr>
  );
};

export default MarginSummaryRow;
