import { FastifyInstance } from 'fastify';
import { assignTowCompany } from '../controllers/towDetailsController';

export default async function (fastify: FastifyInstance) {
  fastify.post('/assign-tow', assignTowCompany);
}
