/**
 * Stub form-submit worker (scdemos contact_us shape, no Slack).
 * Local: npm run worker:form-submit → http://127.0.0.1:8787/
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method === 'GET') {
      return new Response(JSON.stringify({
        ok: true,
        stub: true,
        worker: 'form-submit',
        usage: 'POST JSON { data: { name, email, message } }',
      }), { status: 200, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ ok: false, error: 'method-not-allowed' }), {
        status: 405,
        headers: corsHeaders,
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ ok: false, error: 'invalid-json' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const payload = body?.data || body || {};
    // Accept whatever the form sheet sends — stub does not enforce Slack fields
    return new Response(JSON.stringify({
      ok: true,
      stub: true,
      worker: 'form-submit',
      received: payload,
      message: 'Stub accepted submission. Wire wrangler secrets + real integration for production.',
    }), { status: 200, headers: corsHeaders });
  },
};
