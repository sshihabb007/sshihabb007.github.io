/**
 * Smart Cloudflare Worker - Multi-Server Failover Cobalt CORS Proxy
 * By Mehedi Hasan Shihab (sshihabb007)
 */

const sshihabb007_COBALT_INSTANCES = [
    'https://fox.kittycat.boo/',
    'https://dog.kittycat.boo/',
    'https://cobaltapi.kittycat.boo/',
    'https://cobaltapi.squair.xyz/',
    'https://api.cobalt.liubquanti.click/',
    'https://api.dl.woof.monster/'
];

const shihab_CORS_HEADERS = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
    'Access-Control-Max-Age':       '86400',
};

export default {
    async fetch(request, env, ctx) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: shihab_CORS_HEADERS });
        }

        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Only POST requests are supported' }), {
                status: 405,
                headers: { 'Content-Type': 'application/json', ...shihab_CORS_HEADERS }
            });
        }

        const mehedi_requestBody = await request.text();

        // Server-side failover loop
        for (const shihab_instance of sshihabb007_COBALT_INSTANCES) {
            try {
                const sshihabb007_cobaltResponse = await fetch(shihab_instance, {
                    method:  'POST',
                    headers: {
                        'Accept':       'application/json',
                        'Content-Type': 'application/json',
                        'User-Agent':   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    body: mehedi_requestBody,
                    signal: AbortSignal.timeout(5000) // 5s timeout per server to keep it fast
                });

                if (sshihabb007_cobaltResponse.ok) {
                    const shihab_responseData = await sshihabb007_cobaltResponse.json();
                    
                    // Verify if it's a success payload
                    if (shihab_responseData.status && shihab_responseData.status !== 'error') {
                        return new Response(JSON.stringify(shihab_responseData), {
                            status:  200,
                            headers: {
                                'Content-Type': 'application/json',
                                ...shihab_CORS_HEADERS
                            }
                        });
                    }
                }
            } catch (err) {
                console.warn(`Upstream ${shihab_instance} failed:`, err.message);
            }
        }

        // If all servers failed
        return new Response(JSON.stringify({
            status: 'error',
            error:  { code: 'worker.all_upstreams_exhausted', message: 'All backend extraction instances returned errors.' }
        }), {
            status:  502,
            headers: { 'Content-Type': 'application/json', ...shihab_CORS_HEADERS }
        });
    }
};
