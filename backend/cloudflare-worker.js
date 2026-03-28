/**
 * YADEV PORTFOLIO - PURE CLOUDFLARE WORKER
 * 
 * Instructions:
 * Simply copy and paste this entire file into the Cloudflare Worker editor.
 * No dependencies (like Hono or Express) are required. It uses standard Web APIs.
 * 
 * Required Environment Variables (Set in Cloudflare Dashboard -> Settings -> Variables):
 * - MONGODB_URL: (e.g., https://ap-south-1.aws.data.mongodb-api.com/app/data-xxxxx/endpoint/data/v1)
 * - MONGODB_API_KEY: (MongoDB Data API Key)
 * - MONGODB_DATA_SOURCE: (e.g., Cluster0)
 * - MONGODB_DATABASE: portfolio
 * - ADMIN_USERNAME: admin
 * - ADMIN_PASSWORD: your_secure_password
 * - JWT_SECRET: a_long_random_string
 */

// --- JWT Utilities (Native Web Crypto API) ---
const base64UrlEncode = (arrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const signJWT = async (payload, secret) => {
    const encoder = new TextEncoder();
    const header = base64UrlEncode(encoder.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
    const encodedPayload = base64UrlEncode(encoder.encode(JSON.stringify(payload)));

    const key = await crypto.subtle.importKey(
        'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`${header}.${encodedPayload}`));
    return `${header}.${encodedPayload}.${base64UrlEncode(signature)}`;
};

const verifyJWT = async (token, secret) => {
    try {
        const [header, payload, signature] = token.split('.');
        if (!header || !payload || !signature) return null;

        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
        );

        const signatureBytes = Uint8Array.from(atob(signature.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
        const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(`${header}.${payload}`));

        if (!isValid) return null;
        return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    } catch (e) {
        return null;
    }
};

// --- MongoDB Data API Helper ---
const mongoFetch = async (env, action, collection, payload = {}) => {
    const { MONGODB_API_KEY, MONGODB_URL, MONGODB_DATA_SOURCE, MONGODB_DATABASE } = env;
    const url = `${MONGODB_URL}/action/${action}`;

    const body = {
        dataSource: MONGODB_DATA_SOURCE,
        database: MONGODB_DATABASE, // Ensure you use 'portfolio' or similar
        collection: collection,
        ...payload
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': MONGODB_API_KEY,
            'Accept': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`MongoDB Error: ${response.status} ${err}`);
    }

    return response.json();
};

// --- CORS & HTTP Helpers ---
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const jsonResponse = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
};

// --- Main Worker Export ---
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // 1. Handle CORS Preflight perfectly
        if (method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        // 2. Health check route
        if (path === '/' || path === '/api') {
            return new Response("Yadev Portfolio Serverless API is running!", { headers: corsHeaders });
        }

        try {
            // 3. Handle Authentication Login Route
            if (path === '/api/auth/login' && method === 'POST') {
                const body = await request.json();
                if (body.username === env.ADMIN_USERNAME && body.password === env.ADMIN_PASSWORD) {
                    const token = await signJWT({ admin: true }, env.JWT_SECRET);
                    return jsonResponse({ token, success: true });
                }
                return jsonResponse({ error: 'Invalid credentials' }, 401);
            }

            // 4. API Collections CRUD Router
            const apiRegex = /^\/api\/(projects|career|writing|skills)(?:\/(.*))?$/;
            const match = path.match(apiRegex);

            if (match) {
                const collection = match[1];
                const id = match[2];

                // Authenticate all mutations (POST, DELETE)
                if (method !== 'GET') {
                    const authHeader = request.headers.get('Authorization');
                    if (!authHeader || !authHeader.startsWith('Bearer ')) {
                        return jsonResponse({ error: 'Unauthorized' }, 401);
                    }
                    const token = authHeader.replace('Bearer ', '');
                    const payload = await verifyJWT(token, env.JWT_SECRET);
                    if (!payload || !payload.admin) {
                        return jsonResponse({ error: 'Invalid Token' }, 401);
                    }
                }

                // Handle GET (Read All)
                if (method === 'GET') {
                    // Fetch all documents from the collection, sort newest first
                    const data = await mongoFetch(env, 'find', collection, { sort: { _id: -1 } });
                    return jsonResponse(data.documents || []);
                }

                // Handle POST (Create New)
                if (method === 'POST') {
                    const body = await request.json();
                    body.createdAt = new Date().toISOString();

                    const data = await mongoFetch(env, 'insertOne', collection, { document: body });
                    return jsonResponse({ success: true, insertedId: data.insertedId });
                }

                // Handle DELETE (Remove by ID)
                // Note: The ID comes from the URL, e.g., /api/projects/64a...
                if (method === 'DELETE' && id) {
                    const data = await mongoFetch(env, 'deleteOne', collection, { filter: { _id: { $oid: id } } });
                    return jsonResponse({ success: true, deletedCount: data.deletedCount });
                }
            }

            // Route Not Found
            return jsonResponse({ error: 'Not Found' }, 404);

        } catch (error) {
            // Global Error Handler
            return jsonResponse({ error: error.message }, 500);
        }
    }
};
