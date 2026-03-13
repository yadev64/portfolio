import { Hono } from 'hono'
import { getMongoClient } from '../db/mongoClient.js'

export const projectRoutes = new Hono()

// GET all projects
projectRoutes.get('/', async (c) => {
    try {
        const db = getMongoClient(c.env)
        const data = await db.find('projects', { status: 'published' }, { order: 1 })
        return c.json(data.documents || [])
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})

// GET single project by slug
projectRoutes.get('/:slug', async (c) => {
    try {
        const db = getMongoClient(c.env)
        const data = await db.findOne('projects', { slug: c.req.param('slug') })
        if (!data.document) return c.json({ error: 'Not found' }, 404)
        return c.json(data.document)
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})

// POST create project
projectRoutes.post('/', async (c) => {
    const body = await c.req.json()
    try {
        const db = getMongoClient(c.env)
        const result = await db.insertOne('projects', {
            ...body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })
        return c.json({ success: true, id: result.insertedId }, 201)
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})

// PATCH update project
projectRoutes.patch('/:id', async (c) => {
    const body = await c.req.json()
    try {
        const db = getMongoClient(c.env)
        // _id requires specific BSON ObjectID handling in Data API, 
        // Usually via { $oid: id } in filter
        const result = await db.updateOne('projects',
            { _id: { "$oid": c.req.param('id') } },
            { $set: { ...body, updatedAt: new Date().toISOString() } }
        )
        return c.json({ success: true, modifiedCount: result.modifiedCount })
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})

// DELETE project
projectRoutes.delete('/:id', async (c) => {
    try {
        const db = getMongoClient(c.env)
        const result = await db.deleteOne('projects', { _id: { "$oid": c.req.param('id') } })
        return c.json({ success: true, deletedCount: result.deletedCount })
    } catch (err) {
        return c.json({ error: err.message }, 500)
    }
})
