import { Hono } from 'hono'

export const authRoutes = new Hono()

authRoutes.post('/login', async (c) => {
    const body = await c.req.json()
    const { email, password } = body

    // This is a placeholder since we want a simple admin check
    // In a real app, verify against env variables or DB.
    if (email === c.env.ADMIN_EMAIL && password === c.env.ADMIN_PASSWORD) {
        // Generate JWT placeholder
        // In production use hono/jwt instead
        return c.json({ token: 'mock-jwt-token' })
    }

    return c.json({ error: 'Unauthorized' }, 401)
})

authRoutes.post('/logout', (c) => {
    return c.json({ message: 'Logged out successfully' })
})
