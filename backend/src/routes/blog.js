import { Hono } from 'hono'
import { getMongoClient } from '../db/mongoClient.js'

export const blogRoutes = new Hono()

blogRoutes.get('/', async (c) => {
    try {
        const db = getMongoClient(c.env)
        const data = await db.find('blogs', { status: 'published' }, { published_at: -1 })
        return c.json(data.documents || [])
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})

blogRoutes.get('/:slug', async (c) => {
    try {
        const db = getMongoClient(c.env)
        const data = await db.findOne('blogs', { slug: c.req.param('slug') })
        if (!data.document) return c.json({ error: 'Not found' }, 404)
        return c.json(data.document)
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})

blogRoutes.post('/', async (c) => {
    const body = await c.req.json()
    try {
        const db = getMongoClient(c.env)
        const result = await db.insertOne('blogs', {
            ...body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })
        return c.json({ success: true, id: result.insertedId }, 201)
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})

blogRoutes.patch('/:id', async (c) => {
    const body = await c.req.json()
    try {
        const db = getMongoClient(c.env)
        const result = await db.updateOne('blogs',
            { _id: { "$oid": c.req.param('id') } },
            { $set: { ...body, updatedAt: new Date().toISOString() } }
        )
        return c.json({ success: true, modifiedCount: result.modifiedCount })
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})

blogRoutes.delete('/:id', async (c) => {
    try {
        const db = getMongoClient(c.env)
        const result = await db.deleteOne('blogs', { _id: { "$oid": c.req.param('id') } })
        return c.json({ success: true, deletedCount: result.deletedCount })
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})
