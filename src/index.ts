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

// --- CORS ---
fastify.register(fastifyCors, {
  origin: [
    'http://localhost:3000',
    'https://ais-mag-ver2.vercel.app'
  ],
  credentials: true,
});

// --- JWT ---
fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'supersecret',
})

// --- MongoDB ---
const mongoURI = process.env.MONGO_URI as string
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err))

// --- Routes ---
// Auth routes first
fastify.register(authRoutes, { prefix: '/api/auth' })

// Other routes
fastify.register(userRoutes, { prefix: '/api' })
fastify.register(vehicleRoutes, { prefix: '/api' })
fastify.register(clientRoutes, { prefix: '/api' })
fastify.register(insuranceRoutes, { prefix: '/api' })
fastify.register(towRoutes, { prefix: '/api' })

// --- Start server ---

const port = process.env.PORT || process.env.APP_PORT || 5000
const host = "0.0.0.0"

fastify.listen({ port: Number(port), host }, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`✅ Server running at ${address}`)
})
