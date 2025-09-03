import { FastifyRequest, FastifyReply } from 'fastify'
import Insurance from '../models/insuranceModel'

class InsuranceController {
  async addInsurance(req: FastifyRequest, reply: FastifyReply) {
    try {
      const insurance = new Insurance(req.body)
      await insurance.save()
      reply.send(insurance)
    } catch (err) {
      reply.status(400).send({ message: 'Error creating insurance', error: err })
    }
  }

  async getInsurances(req: FastifyRequest, reply: FastifyReply) {
    const insurances = await Insurance.find().lean()
    reply.send(insurances)
  }
}

export default new InsuranceController()
