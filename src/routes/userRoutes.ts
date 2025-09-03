import { FastifyInstance } from 'fastify'
import { createUser } from '../controllers/userController'

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/users', createUser)
}
