// Simple auth middleware for Hono
export const requireAuth = async (c, next) => {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.split(' ')[1];

    // In production, decode and verify JWT with c.env.JWT_SECRET
    if (token !== 'mock-jwt-token') {
        return c.json({ error: 'Invalid token' }, 401);
    }

    await next();
}
