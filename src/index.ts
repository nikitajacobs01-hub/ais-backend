// src/index.ts
import Fastify from 'fastify'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'

// Routes
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import clientRoutes from './routes/clientRoutes'
import vehicleRoutes from './routes/vehicleRoutes'
import insuranceRoutes from './routes/insuranceRoutes'
import towRoutes from './routes/towRoutes'

dotenv.config()

const fastify = Fastify({ logger: true })

/**
 * ------ CORS (MUST come before JWT and routes) ------
 * We allow localhost and your Vercel production domain.
 * Using a function so the plugin echoes the exact Origin in ACAO.
 */
const allowedOrigins = new Set<string>([
  'http://localhost:3000',
  'https://iasmag.vercel.app', // exact prod domain (no trailing slash)
])

// Optional: allow Vercel preview deploys for this project
const previewRegex = /^https:\/\/.*-iasmag\.vercel\.app$/

fastify.register(fastifyCors, {
  origin: (origin, cb) => {
    // No Origin header (SSR/cURL/server-to-server) → allow
    if (!origin) return cb(null, true)

    if (allowedOrigins.has(origin) || previewRegex.test(origin)) {
      return cb(null, true) // fastify-cors will set Access-Control-Allow-Origin to the request Origin
    }
    // Not allowed
    return cb(new Error('Not allowed by CORS'), false)
  },
  credentials: false, // your frontend uses withCredentials: false (no browser cookies)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
})

/**
 * ------ JWT (register after CORS) ------
 */
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'supersecret',
})

/**
 * ------ Health check route ------
 * Avoid 404s on platform pings to "/"
 */
fastify.route({
  method: ['GET', 'HEAD'],
  url: '/',
  handler: async (_req, reply) => reply.code(200).send({ ok: true }),
})

/**
 * ------ MongoDB ------
 */
const mongoURI = process.env.MONGO_URI as string
mongoose
  .connect(mongoURI)
  .then(() => fastify.log.info('MongoDB connected'))
  .catch((err) => fastify.log.error({ err }, 'MongoDB connection error'))

/**
 * ------ Routes ------
 * Auth first, then the rest
 */
fastify.register(authRoutes, { prefix: '/api/auth' })
fastify.register(userRoutes, { prefix: '/api' })
fastify.register(vehicleRoutes, { prefix: '/api' })
fastify.register(clientRoutes, { prefix: '/api' })
fastify.register(insuranceRoutes, { prefix: '/api' })
fastify.register(towRoutes, { prefix: '/api' })

/**
 * ------ Start server ------
 * Bind to 0.0.0.0 and use the platform-provided PORT (Render)
 */
const port = Number(process.env.PORT || process.env.APP_PORT || 5000)
const host = '0.0.0.0'

fastify.listen({ port, host }, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`✅ Server running at ${address}`)
})
