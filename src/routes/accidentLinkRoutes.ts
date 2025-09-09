import { FastifyInstance } from 'fastify';
import { createAccidentLink, validateAccidentLink } from '../controllers/accidentLinkController';

export default async function accidentLinkRoutes(fastify: FastifyInstance) {
  fastify.post('/api/accident-link', createAccidentLink);
  fastify.get('/api/accident-link/validate/:token', validateAccidentLink);
};