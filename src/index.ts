import Fastify from 'fastify'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes'
import clientRoutes from './routes/clientRoutes'
import vehicleRoutes from './routes/vehicleRoutes'
import insuranceRoutes from './routes/insuranceRoutes'
import towRoutes from './routes/towRoutes'

dotenv.config()
console.log('Environment variables loaded') // to verify dotenv runs
const fastify = Fastify({ logger: true })
console.log('Fastify instance created') // to verify fastify instance creation
const mongoURI = process.env.MONGO_URI as string
console.log('MongoDB URI:', mongoURI) // to verify mongoURI is loaded   
const port = process.env.PORT || 5000
console.log('Server port:', port) // to verify port is loaded

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err))

console.log('MongoDB connection initiated') // to verify mongoose connection initiation
//register routes

console.log('Registering routes...') // to verify before route registration
fastify.register(userRoutes, { prefix: '/api' })
console.log('User routes registered') // to verify user routes registration
fastify.register(vehicleRoutes, { prefix: '/api' })
console.log('Vehicle routes registered') // to verify vehicle routes registration
fastify.register(clientRoutes, { prefix: '/api' })
console.log('Client routes registered') // to verify client routes registration
fastify.register(insuranceRoutes, { prefix: '/api' })
console.log('Insurance routes registered') // to verify insurance routes registration
fastify.register(towRoutes, { prefix: '/api' })
console.log('Tow routes registered') // to verify tow routes registration

console.log('All routes registered') // to verify all routes registration

fastify.listen({ port: Number(port) }, (err, address) => {
    if (err) throw err
    console.log(`Server running at ${address}`)
})