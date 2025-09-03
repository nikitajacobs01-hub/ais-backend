import { FastifyReply, FastifyRequest } from 'fastify'
import User from '../models/userModel'

export const createUser = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { name, email, password } = req.body as {
      name: string
      email: string
      password: string
    }
    console.log('Request body:', req.body)
    const newUser = new User({ name, email, password })
    await newUser.save()

    reply.code(201).send(newUser)
  } catch (error) {
    reply.code(500).send({ message: 'Error creating user', error })
  }
}
