import { useState, useEffect, useCallback } from 'react';
import { MarginService, ServiceExpenses } from '../types/margin';
import { supabase } from '../lib/supabase';

const createDefaultExpenses = (): ServiceExpenses => ({
  doctorSalary: { rub: 0, percent: 0 },
  materials: { rub: 0, percent: 0 },
  acquiring: { rub: 0, percent: 0 },
  custom: [],
});

export const useMarginCalculator = (clientSlug: string) => {
  const [services, setServices] = useState<MarginService[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка услуг из Supabase
  const loadServices = useCallback(async () => {
    if (!clientSlug) return;
    
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('margin_services')
        .select('*')
        .eq('client_slug', clientSlug)
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Error loading services:', fetchError);
        setError('Ошибка загрузки услуг');
        return;
      }

      if (data) {
        const mappedServices: MarginService[] = data.map((row) => ({
          id: row.service_id,
          name: row.name,
          currentPrice: row.current_price,
          expenses: row.expenses as ServiceExpenses,
          createdAt: new Date(row.created_at).getTime(),
          updatedAt: new Date(row.updated_at).getTime(),
        }));

        setServices(mappedServices);
        
        // Автоматически выбираем первую услугу
        if (mappedServices.length > 0 && !selectedServiceId) {
          setSelectedServiceId(mappedServices[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading services:', err);
      setError('Ошибка загрузки услуг');
    } finally {
      setIsLoading(false);
    }
  }, [clientSlug, selectedServiceId]);

  // Загрузка при монтировании
  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // Создать новую услугу
  const createService = useCallback(async (name: string) => {
    if (!clientSlug) return null;

    const newService: MarginService = {
      id: `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      currentPrice: 0,
      expenses: createDefaultExpenses(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      const { error: insertError } = await supabase
        .from('margin_services')
        .insert({
          client_slug: clientSlug,
          service_id: newService.id,
          name: newService.name,
          current_price: newService.currentPrice,
          expenses: newService.expenses,
        });

      if (insertError) {
        console.error('Error creating service:', insertError);
        setError('Ошибка создания услуги');
        return null;
      }

      setServices((prev) => [...prev, newService]);
      setSelectedServiceId(newService.id);
      return newService;
    } catch (err) {
      console.error('Error creating service:', err);
      setError('Ошибка создания услуги');
      return null;
    }
  }, [clientSlug]);

  // Обновить услугу
  const updateService = useCallback(async (id: string, updates: Partial<MarginService>) => {
    if (!clientSlug) return;

    const updatedService = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Маппинг полей для Supabase
    const supabaseUpdates: any = {};
    if (updates.name !== undefined) supabaseUpdates.name = updates.name;
    if (updates.currentPrice !== undefined) supabaseUpdates.current_price = updates.currentPrice;
    if (updates.expenses !== undefined) supabaseUpdates.expenses = updates.expenses;
    supabaseUpdates.updated_at = new Date().toISOString();

    try {
      const { error: updateError } = await supabase
        .from('margin_services')
        .update(supabaseUpdates)
        .eq('client_slug', clientSlug)
        .eq('service_id', id);

      if (updateError) {
        console.error('Error updating service:', updateError);
        setError('Ошибка обновления услуги');
        return;
      }

      setServices((prev) =>
        prev.map((service) =>
          service.id === id
            ? { ...service, ...updates, updatedAt: Date.now() }
            : service
        )
      );
    } catch (err) {
      console.error('Error updating service:', err);
      setError('Ошибка обновления услуги');
    }
  }, [clientSlug]);

  // Удалить услугу
  const deleteService = useCallback(async (id: string) => {
    if (!clientSlug) return;

    try {
      const { error: deleteError } = await supabase
        .from('margin_services')
        .delete()
        .eq('client_slug', clientSlug)
        .eq('service_id', id);

      if (deleteError) {
        console.error('Error deleting service:', deleteError);
        setError('Ошибка удаления услуги');
        return;
      }

      setServices((prev) => {
        const filtered = prev.filter((service) => service.id !== id);
        if (selectedServiceId === id && filtered.length > 0) {
          setSelectedServiceId(filtered[0].id);
        } else if (filtered.length === 0) {
          setSelectedServiceId(null);
        }
        return filtered;
      });
    } catch (err) {
      console.error('Error deleting service:', err);
      setError('Ошибка удаления услуги');
    }
  }, [clientSlug, selectedServiceId]);

  // Получить выбранную услугу
  const selectedService = services.find((s) => s.id === selectedServiceId) || null;

  return {
    services,
    selectedService,
    selectedServiceId,
    setSelectedServiceId,
    createService,
    updateService,
    deleteService,
    isLoading,
    error,
    reload: loadServices,
  };
};
