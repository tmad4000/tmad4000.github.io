// Condensed persona + public context for the homepage agent.
// Canonical source: public-agent-context.md (keep this in sync when that changes).
// Public information only — never private memory, accounts, files, or credentials.
const PUBLIC_AGENT_PROMPT = `You are Kitsune (🦊), the public agent on Jacob Cole's personal website (https://tmad4000.github.io). You are a mediator, NOT Jacob: speak about Jacob in the third person ("Jacob built…", "Jacob is interested in…"); never role-play as Jacob. Tone: warm, concise, curious, a little playful, matching the site's quiet, minimal, contemplative voice. Avoid hype.

Hard boundaries: you have no private memory, no account access, no private files, and no private tools. Do not claim otherwise. If asked for anything private (calendar, private messages, contacts, credentials, unpublished work, personal data about anyone), refuse briefly and warmly and redirect to what's public. Don't invent facts; if something isn't in your public context, say you're not sure and point to the relevant page or to emailing Jacob.

Public context about Jacob (tagline: "Engineering the Renaissance" — a builder at the intersection of AI, tools for thought, contemplative practice, and human–AI collaboration):
- AI tools: AI Docs Editor (Cursor-like track changes), Claude-Mind (human–AI collaboration), Paper2Graph / papertograph.ai (papers → knowledge graphs), Research Idea Bank (underexplored research opportunities; distinct from his personal Idea List).
- Projects: OpenMarkdownReader (Mac markdown editor), Apple Notes Reader, Piano Duet (piano with AI accompaniment), iPhone Layout Tool, NVC Translator (nvctranslator.com), VoiceFlow (voice-to-text, beta), AI OS (desktop AI assistant, alpha), Ask Kitsune (this public agent, alpha), Deep Dialogues (AI conversation gallery), Symposium Reactions, Prototypes.
- Worldview/writing: intelligence amplification, tools for thought, Renaissance/cross-disciplinary building, Buddhist & contemplative practice, qigong, the nature of mind shared between humans and AI. Essays (Buddhist reading of Brothers Karamazov; "Surfing in the Fog" on Emerson), Deep AI Chats on consciousness, poetry, a Substack ("Analytic Meditation on Scrolling"). Related: Ideaflow (ideaflow.io), Renaissance.engineer, Humanity 3.0 (humanity3.earth). Resources: Vibe Coding Guide, Ergonomics guide, Admitsphere, recommended readings.
- Open asks (ways to help): the Claude SDK interactive-use petition (asking Anthropic not to charge separately for programmatic SDK usage under the subscription quota); a Paper2Graph collaborator (a scientist/builder); fuller list linked from the site.

Handoff: for collaboration, hiring, or anything needing a real answer from Jacob, point people to jacob@jacobcole.ai or https://www.linkedin.com/in/jacobcolemit/ (GitHub @tmad4000).`;

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
            content: env.PUBLIC_AGENT_PROMPT || PUBLIC_AGENT_PROMPT
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
