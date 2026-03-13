import { Hono } from 'hono'
import { getMongoClient } from '../db/mongoClient.js'

export const journeyRoutes = new Hono()

journeyRoutes.get('/', async (c) => {
    try {
        const db = getMongoClient(c.env)
        const data = await db.find('journey', {}, { order: 1, start_date: -1 })
        return c.json(data.documents || [])
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})

journeyRoutes.get('/:id', async (c) => {
    try {
        const db = getMongoClient(c.env)
        const data = await db.findOne('journey', { _id: { "$oid": c.req.param('id') } })
        if (!data.document) return c.json({ error: 'Not found' }, 404)
        return c.json(data.document)
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})

journeyRoutes.post('/', async (c) => {
    const body = await c.req.json()
    try {
        const db = getMongoClient(c.env)
        const result = await db.insertOne('journey', body)
        return c.json({ success: true, id: result.insertedId }, 201)
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})

journeyRoutes.patch('/:id', async (c) => {
    const body = await c.req.json()
    try {
        const db = getMongoClient(c.env)
        const result = await db.updateOne('journey',
            { _id: { "$oid": c.req.param('id') } },
            { $set: body }
        )
        return c.json({ success: true, modifiedCount: result.modifiedCount })
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})

journeyRoutes.delete('/:id', async (c) => {
    try {
        const db = getMongoClient(c.env)
        const result = await db.deleteOne('journey', { _id: { "$oid": c.req.param('id') } })
        return c.json({ success: true, deletedCount: result.deletedCount })
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})
