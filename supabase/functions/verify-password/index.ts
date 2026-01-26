import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // 1. САМОЕ ВАЖНОЕ: Отвечаем браузеру на "рукопожатие"
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { slug, password } = await req.json()

    // 2. Создаем клиент (используем Service Role, так как RLS включен)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 3. Ищем клиента
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !client) {
      return new Response(
        JSON.stringify({ success: false, error: 'Клиент не найден' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // 4. Сравниваем пароль
    if (String(password).trim() !== String(client.password_hash).trim()) {
      return new Response(
        JSON.stringify({ success: false, error: 'Неверный пароль' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        client: { name: client.name, csv_url: client.csv_url }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  }
})
