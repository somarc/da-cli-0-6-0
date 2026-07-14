/**
 * Stub auth session worker (anonymous session JSON shape).
 * Local: npm run worker:auth-session → http://127.0.0.1:8788/
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '') || '/';

    if (request.method === 'GET' && (path === '/' || path.endsWith('/auth/session') || path === '/session')) {
      return new Response(JSON.stringify({
        ok: true,
        stub: true,
        worker: 'auth-session',
        authenticated: false,
        anonymous: true,
        user: null,
        message: 'Stub anonymous session. Replace with Cloudflare Access / real auth worker for production.',
      }), { status: 200, headers: corsHeaders });
    }

    return new Response(JSON.stringify({
      ok: false,
      stub: true,
      error: 'not-found',
      path,
    }), { status: 404, headers: corsHeaders });
  },
};
