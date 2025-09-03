import { FastifyInstance } from 'fastify';
import { createClient, getClients, getClientById } from '../controllers/clientController';

export default async function clientRoutes(fastify: FastifyInstance) {
  fastify.post('/clients', createClient);
  fastify.get('/clients', getClients);
  fastify.get('/clients/:id', getClientById);
}
