import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authRoutes } from './routes/auth.js'
import { projectRoutes } from './routes/projects.js'
import { mediaRoutes } from './routes/media.js'
import { journeyRoutes } from './routes/journey.js'
import { blogRoutes } from './routes/blog.js'
import { skillsRoutes } from './routes/skills.js'

const app = new Hono()

// Middleware
app.use('/*', cors())

// Define a route for the root path
app.get('/', (c) => c.text('Yadev Portfolio API is running!'))

// Routes
app.route('/api/auth', authRoutes)
app.route('/api/projects', projectRoutes)
app.route('/api/media', mediaRoutes)
app.route('/api/journey', journeyRoutes)
app.route('/api/blog', blogRoutes)
app.route('/api/skills', skillsRoutes)

export default app
