import { FastifyInstance } from 'fastify'
import VehicleController from '../controllers/vehicleController'

export default async function vehicleRoutes(fastify: FastifyInstance) {
  fastify.get('/vehicles', VehicleController.getVehicles)
  fastify.post('/vehicles', VehicleController.addVehicle)
}
