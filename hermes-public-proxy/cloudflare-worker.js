export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = env.ALLOWED_ORIGIN || 'https://tmad4000.github.io';
    const corsHeaders = {
      'Access-Control-Allow-Origin': origin === allowedOrigin ? origin : allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/api/hermes-chat') {
      return json({ error: 'not_found' }, 404, corsHeaders);
    }

    let body;
    try {
      const text = await request.text();
      if (text.length > 24_000) return json({ error: 'request_too_large' }, 413, corsHeaders);
      body = JSON.parse(text || '{}');
    } catch {
      return json({ error: 'invalid_json' }, 400, corsHeaders);
    }

    const incoming = Array.isArray(body.messages) ? body.messages : [];
    const messages = incoming
      .slice(-12)
      .map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '').slice(0, 4000) }))
      .filter((m) => m.content.trim());

    if (!messages.length) return json({ error: 'empty_message' }, 400, corsHeaders);

    const hermesBase = (env.HERMES_API_BASE || '').replace(/\/$/, '');
    if (!hermesBase || !env.HERMES_API_KEY) {
      return json({ error: 'proxy_not_configured' }, 503, corsHeaders);
    }

    const upstream = await fetch(`${hermesBase}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.HERMES_API_KEY}`,
        'X-Hermes-Session-Key': 'homepage-public'
      },
      body: JSON.stringify({
        model: env.HERMES_MODEL || 'public-hermes',
        stream: false,
        messages: [
          {
            role: 'system',
            content: 'You are Jacob Cole\'s public website Hermes agent. Be helpful, concise, and privacy-preserving. Do not claim private access.'
          },
          ...messages
        ]
      })
    });

    const upstreamText = await upstream.text();
    if (!upstream.ok) {
      return json({ error: 'hermes_upstream_error', status: upstream.status, detail: upstreamText.slice(0, 500) }, 502, corsHeaders);
    }

    let data;
    try { data = JSON.parse(upstreamText); }
    catch { return json({ error: 'invalid_upstream_json' }, 502, corsHeaders); }

    const reply = data?.choices?.[0]?.message?.content || '';
    return json({ reply }, 200, corsHeaders);
  }
};

function json(value, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders
    }
  });
}
