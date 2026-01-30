import React from 'react';
import { MarginService } from '../../types/margin';
import MarginSummaryRow from './MarginSummaryRow';

interface MarginSummaryProps {
  services: MarginService[];
  onEditService: (serviceId: string) => void;
  isDark: boolean;
}

const MarginSummary: React.FC<MarginSummaryProps> = ({ services, onEditService, isDark }) => {
  if (services.length === 0) {
    return (
      <div className={`flex items-center justify-center rounded-2xl border min-h-[400px] ${
        isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="text-center p-12">
          <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📊</span>
          </div>
          <h3 className={`text-xl font-bold mb-2 ${
            isDark ? 'text-slate-100' : 'text-slate-800'
          }`}>
            Нет услуг
          </h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Создайте первую услугу чтобы увидеть сводку
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isDark ? 'bg-slate-800/60' : 'bg-slate-50'}>
            <tr>
              <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Наименование
              </th>
              <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Текущая стоимость
              </th>
              <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Маржа (%)
              </th>
              <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Маржа (₽)
              </th>
              <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Рекомендуемая цена
              </th>
              <th className={`py-4 px-4 text-left text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <MarginSummaryRow
                key={service.id}
                service={service}
                onEdit={onEditService}
                isDark={isDark}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarginSummary;
