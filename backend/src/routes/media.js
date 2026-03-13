import { Hono } from 'hono'
import { getMongoClient } from '../db/mongoClient.js'

export const mediaRoutes = new Hono()

mediaRoutes.get('/', async (c) => {
    try {
        const db = getMongoClient(c.env)
        const data = await db.find('media', {}, { uploadedAt: -1 })
        return c.json(data.documents || [])
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})

// Stub for R2 upload, for full production we use c.env.MY_BUCKET.put()
mediaRoutes.post('/upload', async (c) => {
    try {
        // 1. Get multipart form data (the actual file)
        // 2. Upload to c.env.MY_BUCKET
        // 3. Save URL to db

        // Stub implementation:
        const body = await c.req.parseBody()
        const file = body['file']

        if (file && c.env.MY_BUCKET) {
            // await c.env.MY_BUCKET.put(file.name, file)
            // url = `https://your-r2-public-url.com/${file.name}`
        }

        const mockUrl = "https://mock-image-url.com/" + (file?.name || "test.jpg");

        const db = getMongoClient(c.env)
        const result = await db.insertOne('media', {
            url: mockUrl,
            type: file?.type?.includes('video') ? 'video' : 'image',
            caption: '',
            tags: [],
            uploadedAt: new Date().toISOString()
        })

        return c.json({ success: true, id: result.insertedId, url: mockUrl }, 201)
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})

mediaRoutes.delete('/:id', async (c) => {
    try {
        const db = getMongoClient(c.env)

        // Also remove from R2 bucket in a real implementation
        // await c.env.MY_BUCKET.delete(key)

        const result = await db.deleteOne('media', { _id: { "$oid": c.req.param('id') } })
        return c.json({ success: true, deletedCount: result.deletedCount })
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})
