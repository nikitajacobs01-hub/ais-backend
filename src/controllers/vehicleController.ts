import { FastifyRequest, FastifyReply } from 'fastify'
import Vehicle from '../models/vehicleModel'

class VehicleController {
  async addVehicle(req: FastifyRequest, reply: FastifyReply) {
    try {
      const vehicle = new Vehicle(req.body)
      await vehicle.save()
      reply.send(vehicle)
    } catch (err) {
      reply.status(400).send({ message: 'Error creating vehicle', error: err })
    }
  }

  async getVehicles(req: FastifyRequest, reply: FastifyReply) {
    const vehicles = await Vehicle.find().lean()
    reply.send(vehicles)
  }
}

export default new VehicleController()
