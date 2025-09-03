import { FastifyInstance } from 'fastify'
import InsuranceController from '../controllers/insuranceController'

export default async function insuranceRoutes(fastify: FastifyInstance) {
  fastify.get('/insurances', InsuranceController.getInsurances)
  fastify.post('/insurances', InsuranceController.addInsurance)
}
