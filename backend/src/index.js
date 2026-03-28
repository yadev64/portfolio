import { Hono } from 'hono'
import { cors } from 'hono/cors'

// JWT Utilities (Native Web Crypto API)
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

// MongoDB Data API Helper
const mongoFetch = async (c, action, collection, payload = {}) => {
    const { MONGODB_API_KEY, MONGODB_URL, MONGODB_DATA_SOURCE, MONGODB_DATABASE } = c.env;
    const url = `${MONGODB_URL}/action/${action}`;

    // Default payload structure required by Data API
    const body = {
        dataSource: MONGODB_DATA_SOURCE,
        database: MONGODB_DATABASE,
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

const app = new Hono()
app.use('/*', cors())

app.get('/', (c) => c.text('Yadev Portfolio Serverless API is running!'))

// --- AUTH MIDDLEWARE ---
const authMiddleware = async (c, next) => {
    // Only protect POST/PUT/DELETE routes, allow GET for public consumption
    if (c.req.method === 'GET') {
        return next();
    }

    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return c.json({ error: 'Unauthorized' }, 401);

    const payload = await verifyJWT(token, c.env.JWT_SECRET);
    if (!payload || !payload.admin) return c.json({ error: 'Invalid Token' }, 401);

    return next();
};

// Apply auth middleware to API routes (will pass through GET)
app.use('/api/*', authMiddleware);


// --- AUTHENTICATION ---
app.post('/api/auth/login', async (c) => {
    const { username, password } = await c.req.json();

    // In production, compare with env bounds or db hash. Currently using hardcoded secure envs
    if (username === c.env.ADMIN_USERNAME && password === c.env.ADMIN_PASSWORD) {
        const token = await signJWT({ admin: true }, c.env.JWT_SECRET);
        return c.json({ token, success: true });
    }
    return c.json({ error: 'Invalid credentials' }, 401);
});


// --- ROUTE GENERATOR ---
// A helper to generate standard CRUD endpoints for any collection
const createCrudRoutes = (path, collectionName) => {
    // Get all items
    app.get(`/api/${path}`, async (c) => {
        try {
            const data = await mongoFetch(c, 'find', collectionName, { sort: { _id: -1 } });
            return c.json(data.documents || []);
        } catch (e) {
            return c.json({ error: e.message }, 500);
        }
    });

    // Create item
    app.post(`/api/${path}`, async (c) => {
        try {
            const body = await c.req.json();
            body.createdAt = new Date().toISOString();

            const data = await mongoFetch(c, 'insertOne', collectionName, { document: body });
            return c.json({ success: true, insertedId: data.insertedId });
        } catch (e) {
            return c.json({ error: e.message }, 500);
        }
    });

    // Delete item
    app.delete(`/api/${path}/:id`, async (c) => {
        try {
            const id = c.req.param('id');
            const data = await mongoFetch(c, 'deleteOne', collectionName, { filter: { _id: { $oid: id } } });
            return c.json({ success: true, deletedCount: data.deletedCount });
        } catch (e) {
            return c.json({ error: e.message }, 500);
        }
    });
};

// Generate standard CRUD routes mapping to MongoDB Collections
createCrudRoutes('projects', 'projects');
createCrudRoutes('career', 'career');
createCrudRoutes('writing', 'writing');
createCrudRoutes('skills', 'skills');

export default app;
