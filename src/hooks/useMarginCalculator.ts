import { useState, useEffect, useCallback } from 'react';
import { MarginService, ServiceExpenses } from '../types/margin';

const STORAGE_KEY = 'margin_calculator_services';

const createDefaultExpenses = (): ServiceExpenses => ({
  doctorSalary: { rub: 0, percent: 0 },
  materials: { rub: 0, percent: 0 },
  acquiring: { rub: 0, percent: 0 },
  custom: [],
});

export const useMarginCalculator = () => {
  const [services, setServices] = useState<MarginService[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Загрузка из localStorage при монтировании
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setServices(parsed);
        if (parsed.length > 0) {
          setSelectedServiceId(parsed[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading services from localStorage:', error);
    }
  }, []);

  // Сохранение в localStorage при изменении
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    } catch (error) {
      console.error('Error saving services to localStorage:', error);
    }
  }, [services]);

  // Создать новую услугу
  const createService = useCallback((name: string) => {
    const newService: MarginService = {
      id: `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      currentPrice: 0,
      expenses: createDefaultExpenses(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    setServices(prev => [...prev, newService]);
    setSelectedServiceId(newService.id);
    return newService;
  }, []);

  // Обновить услугу
  const updateService = useCallback((id: string, updates: Partial<MarginService>) => {
    setServices(prev => prev.map(service => 
      service.id === id 
        ? { ...service, ...updates, updatedAt: Date.now() }
        : service
    ));
  }, []);

  // Удалить услугу
  const deleteService = useCallback((id: string) => {
    setServices(prev => {
      const filtered = prev.filter(service => service.id !== id);
      if (selectedServiceId === id && filtered.length > 0) {
        setSelectedServiceId(filtered[0].id);
      } else if (filtered.length === 0) {
        setSelectedServiceId(null);
      }
      return filtered;
    });
  }, [selectedServiceId]);

  // Получить выбранную услугу
  const selectedService = services.find(s => s.id === selectedServiceId) || null;

  return {
    services,
    selectedService,
    selectedServiceId,
    setSelectedServiceId,
    createService,
    updateService,
    deleteService,
  };
};
