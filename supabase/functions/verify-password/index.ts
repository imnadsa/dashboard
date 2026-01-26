// Используем стабильную версию библиотеки
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // 1. СРАЗУ обрабатываем Preflight запрос (OPTIONS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 2. Проверяем, что тело запроса не пустое
    let body;
    try {
      body = await req.json();
    } catch (e) {
      throw new Error("Некорректный JSON в запросе");
    }

    const { slug, password } = body;

    console.log(`Попытка входа: slug=${slug}`); // Это будет в логах Supabase

    if (!slug || !password) {
      throw new Error("Не передан slug или пароль");
    }

    // 3. Получаем ключи (безопасно)
    // ВАЖНО: Убедись, что SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY есть в Secrets
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error("CRITICAL: Keys missing in environment variables");
      throw new Error("Ошибка конфигурации сервера (Keys missing)");
    }

    // 4. Создаем клиент
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 5. Делаем запрос в базу
    const { data: client, error } = await supabase
      .from('clients')
      .select('name, csv_url, password_hash')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error("Supabase DB Error:", error);
      // Не роняем сервер, а возвращаем ошибку клиенту
      return new Response(
        JSON.stringify({ success: false, error: 'Ошибка БД: ' + error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    if (!client) {
      console.log("Клиент не найден");
      return new Response(
        JSON.stringify({ success: false, error: 'Клиент не найден' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // 6. Сверяем пароль (как текст)
    // Приводим к строке и убираем пробелы, чтобы исключить глупые ошибки
    const inputPwd = String(password).trim();
    const dbPwd = String(client.password_hash).trim();

    if (inputPwd !== dbPwd) {
      console.log("Пароль не совпал");
      return new Response(
        JSON.stringify({ success: false, error: 'Неверный пароль' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // 7. Успех
    console.log("Успешный вход!");
    return new Response(
      JSON.stringify({
        success: true,
        client: {
          name: client.name,
          csv_url: client.csv_url
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (err: any) {
    // Ловим ЛЮБУЮ ошибку, чтобы сервер не упал молча
    console.error("Unhandled Error:", err);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal Server Error: ' + err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
