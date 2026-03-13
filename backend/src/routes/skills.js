import { Hono } from 'hono'
import { getMongoClient } from '../db/mongoClient.js'

export const skillsRoutes = new Hono()

skillsRoutes.get('/', async (c) => {
    try {
        const db = getMongoClient(c.env)
        const data = await db.find('skills', {}, { order: 1 })
        return c.json(data.documents || [])
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})

skillsRoutes.post('/', async (c) => {
    const body = await c.req.json()
    try {
        const db = getMongoClient(c.env)
        const result = await db.insertOne('skills', body)
        return c.json({ success: true, id: result.insertedId }, 201)
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})

skillsRoutes.patch('/:id', async (c) => {
    const body = await c.req.json()
    try {
        const db = getMongoClient(c.env)
        const result = await db.updateOne('skills',
            { _id: { "$oid": c.req.param('id') } },
            { $set: body }
        )
        return c.json({ success: true, modifiedCount: result.modifiedCount })
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})

skillsRoutes.delete('/:id', async (c) => {
    try {
        const db = getMongoClient(c.env)
        const result = await db.deleteOne('skills', { _id: { "$oid": c.req.param('id') } })
        return c.json({ success: true, deletedCount: result.deletedCount })
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})
