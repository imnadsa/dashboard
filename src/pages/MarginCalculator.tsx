import React from 'react';
import { useMarginCalculator } from '../hooks/useMarginCalculator';
import { ServicesList, ServiceCalculator } from '../components/margin';

interface MarginCalculatorProps {
  isDark: boolean;
  clientSlug: string;  // ← ДОБАВИЛ
}

const MarginCalculator: React.FC<MarginCalculatorProps> = ({ isDark, clientSlug }) => {
  const {
    services,
    selectedService,
    selectedServiceId,
    setSelectedServiceId,
    createService,
    updateService,
    deleteService,
    isLoading,
    error,
  } = useMarginCalculator(clientSlug);  // ← ПЕРЕДАЁМ clientSlug

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand/30 border-t-brand rounded-full animate-spin mx-auto mb-4" />
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Загрузка услуг...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className={`text-sm ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-20 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Заголовок страницы */}
        <div className="mb-8">
          <h1 className={`text-3xl font-black tracking-tight mb-2 ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Калькулятор маржи
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Рассчитайте оптимальную стоимость услуг с учётом всех расходов
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Левая панель - список услуг */}
          <div className="lg:w-80 flex-shrink-0">
            <ServicesList
              services={services}
              selectedServiceId={selectedServiceId}
              onSelectService={setSelectedServiceId}
              onCreateService={createService}
              onUpdateService={updateService}
              onDeleteService={deleteService}
              isDark={isDark}
            />
          </div>

          {/* Правая часть - калькулятор */}
          <div className="flex-1 min-w-0">
            {selectedService ? (
              <ServiceCalculator
                service={selectedService}
                onUpdateService={updateService}
                isDark={isDark}
              />
            ) : (
              <div className={`h-full flex items-center justify-center rounded-2xl border ${
                isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <div className="text-center p-12">
                  <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">📊</span>
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${
                    isDark ? 'text-slate-100' : 'text-slate-800'
                  }`}>
                    Выберите услугу
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Создайте новую услугу или выберите существующую из списка слева
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarginCalculator;
