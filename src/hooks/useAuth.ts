import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { AuthResponse, AuthState } from '../types';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'dashboard_auth_token',
  CLIENT_NAME: 'dashboard_client_name',
  CSV_URL: 'dashboard_csv_url',
  SLUG: 'dashboard_slug',
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>(() => {
    // Check saved session
    const savedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const savedName = localStorage.getItem(STORAGE_KEYS.CLIENT_NAME);
    const savedCsvUrl = localStorage.getItem(STORAGE_KEYS.CSV_URL);
    const savedSlug = localStorage.getItem(STORAGE_KEYS.SLUG);  // ← ДОБАВИЛ

    if (savedToken && savedName && savedCsvUrl) {
      return {
        isAuthenticated: true,
        isLoading: false,
        clientName: savedName,
        csvUrl: savedCsvUrl,
        slug: savedSlug,  // ← ДОБАВИЛ
        error: null,
      };
    }

    return {
      isAuthenticated: false,
      isLoading: false,
      clientName: null,
      csvUrl: null,
      slug: null,  // ← ДОБАВИЛ
      error: null,
    };
  });

  const login = useCallback(async (slug: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase.functions.invoke<AuthResponse>('verify-password', {
        body: { slug, password }
      });

      if (error || !data?.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: data?.error || 'Ошибка авторизации'
        }));
        return false;
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, `${slug}_${Date.now()}`);
      localStorage.setItem(STORAGE_KEYS.SLUG, slug);
      localStorage.setItem(STORAGE_KEYS.CLIENT_NAME, data.client!.name);
      localStorage.setItem(STORAGE_KEYS.CSV_URL, data.client!.csv_url);

      setState({
        isAuthenticated: true,
        isLoading: false,
        clientName: data.client!.name,
        csvUrl: data.client!.csv_url,
        slug: slug,  // ← ДОБАВИЛ
        error: null,
      });

      return true;
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Ошибка соединения с сервером'
      }));
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.SLUG);
    localStorage.removeItem(STORAGE_KEYS.CLIENT_NAME);
    localStorage.removeItem(STORAGE_KEYS.CSV_URL);

    setState({
      isAuthenticated: false,
      isLoading: false,
      clientName: null,
      csvUrl: null,
      slug: null,  // ← ДОБАВИЛ
      error: null,
    });
  }, []);

  return {
    ...state,
    login,
    logout,
  };
};
