import { FastifyInstance } from 'fastify'
import TowController from '../controllers/towController'

export default async function towRoutes(fastify: FastifyInstance) {
  fastify.get('/tows', TowController.getTows)
  fastify.post('/tows', TowController.addTow)
}
