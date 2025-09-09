// src/index.ts
import Fastify from 'fastify'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fastifyJwt from '@fastify/jwt'
import fastifyCors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'

// Routes
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import clientRoutes from './routes/clientRoutes'
import vehicleRoutes from './routes/vehicleRoutes'
import insuranceRoutes from './routes/insuranceRoutes'
import towRoutes from './routes/towRoutes'
import accidentLinkRoutes from './routes/accidentLinkRoutes'
import accidentRoutes from './routes/accidentRoutes'
import towDetailsRoutes from './routes/towDetailsroutes'

dotenv.config()

const fastify = Fastify({
  logger: true,
  bodyLimit: 50 * 1024 * 1024, // 50 MB
})

/**
 * ------ CORS (must be before JWT and routes) ------
 */
const allowedOrigins = new Set([
  'http://localhost:3000',
  'https://iasmag.vercel.app',
])
const previewRegex = /^https:\/\/.*-iasmag\.vercel\.app$/

fastify.register(fastifyCors, {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    if (allowedOrigins.has(origin) || previewRegex.test(origin)) return cb(null, true)
    return cb(new Error('Not allowed by CORS'), false)
  },
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
})

/**
 * ------ JWT ------
 */
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'supersecret',
})

/**
 * ------ Health check ------
 */
fastify.route({
  method: ['GET', 'HEAD'],
  url: '/',
  handler: async (_req, reply) => reply.code(200).send({ ok: true }),
})

/**
 * ------ Multipart (only once!) ------
 */
fastify.register(fastifyMultipart, {
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB per file
    files: 5,
  },
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
 */
fastify.register(authRoutes, { prefix: '/api/auth' })
fastify.register(userRoutes, { prefix: '/api' })
fastify.register(vehicleRoutes, { prefix: '/api' })
fastify.register(clientRoutes, { prefix: '/api' })
fastify.register(insuranceRoutes, { prefix: '/api' })
fastify.register(towRoutes, { prefix: '/api' })
fastify.register(accidentLinkRoutes)
fastify.register(accidentRoutes, { prefix: '/api' })
fastify.register(towDetailsRoutes, { prefix: '/api' })

/**
 * ------ Start server ------
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
