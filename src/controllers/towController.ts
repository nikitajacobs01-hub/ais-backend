import { FastifyRequest, FastifyReply } from 'fastify'
import Tow from '../models/towModel'

class TowController {
  async addTow(req: FastifyRequest, reply: FastifyReply) {
    try {
      const tow = new Tow(req.body)
      await tow.save()
      reply.send(tow)
    } catch (err) {
      reply.status(400).send({ message: 'Error creating tow', error: err })
    }
  }

  async getTows(req: FastifyRequest, reply: FastifyReply) {
    const tows = await Tow.find().lean()
    reply.send(tows)
  }
}

export default new TowController()
