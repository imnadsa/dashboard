import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Обработка CORS (чтобы браузер не ругался)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { slug, password } = await req.json();

    if (!slug || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Slug and password required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // ВАЖНО: Используем SERVICE_ROLE_KEY, так как ты включил RLS (защиту)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Ищем клиента
    const { data: client, error } = await supabase
      .from('clients')
      .select('name, csv_url, password_hash')
      .eq('slug', slug)
      .single();

    if (error || !client) {
      return new Response(
        JSON.stringify({ success: false, error: 'Клиент не найден' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Проверяем пароль (как текст)
    if (password !== client.password_hash) {
      return new Response(
        JSON.stringify({ success: false, error: 'Неверный пароль' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Успех
    return new Response(
      JSON.stringify({
        success: true,
        client: {
          name: client.name,
          csv_url: client.csv_url
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: 'Server error: ' + err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
