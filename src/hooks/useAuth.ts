import { useState, useEffect } from 'react';

const AUTH_STORAGE_KEY = 'auth_data';

interface AuthData {
  clientName: string;
  csvUrl: string;
  slug: string;  // ← ДОБАВИЛИ
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clientName, setClientName] = useState<string | null>(null);
  const [csvUrl, setCsvUrl] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);  // ← ДОБАВИЛИ
  const [error, setError] = useState<string | null>(null);

  // Проверяем сохранённую сессию при загрузке
  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const data: AuthData = JSON.parse(stored);
          setClientName(data.clientName);
          setCsvUrl(data.csvUrl);
          setSlug(data.slug);  // ← ДОБАВИЛИ
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Error reading auth data:', err);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Логин
  const login = async (inputSlug: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ slug: inputSlug, password }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Ошибка авторизации');
        setIsLoading(false);
        return false;
      }

      // Сохраняем данные включая slug
      const authData: AuthData = {
        clientName: data.client.name,
        csvUrl: data.client.csv_url,
        slug: data.client.slug,  // ← ДОБАВИЛИ
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      
      setClientName(authData.clientName);
      setCsvUrl(authData.csvUrl);
      setSlug(authData.slug);  // ← ДОБАВИЛИ
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError('Ошибка подключения к серверу');
      setIsLoading(false);
      return false;
    }
  };

  // Логаут
  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    setClientName(null);
    setCsvUrl(null);
    setSlug(null);  // ← ДОБАВИЛИ
  };

  return {
    isAuthenticated,
    isLoading,
    clientName,
    csvUrl,
    slug,  // ← ДОБАВИЛИ в возврат
    error,
    login,
    logout,
  };
};
