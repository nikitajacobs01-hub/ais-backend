import { FastifyInstance } from 'fastify'
import { createClient, getClients } from '../controllers/clientController'

export default async function clientRoutes(fastify: FastifyInstance) {
  console.log('Client routes loaded') // to verify it runs
  fastify.post('/clients', createClient)
  fastify.get('/clients', getClients)
}
