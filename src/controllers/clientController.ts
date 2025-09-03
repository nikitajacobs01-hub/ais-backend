import { FastifyReply, FastifyRequest } from 'fastify'
import Client from '../models/clientModel'

export const createClient = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const {
      firstName,
      lastName,
      idNumber,
      dob,
      email,
      street,
      suburb,
      city
    } = req.body as {
      firstName: string
      lastName: string
      idNumber: string
      dob: string
      email: string
      street: string
      suburb: string
      city: string
    }

    console.log('Request body:', req.body)

    const newClient = new Client({
      firstName,
      lastName,
      idNumber,
      dob,
      email,
      street,
      suburb,
      city
    })

    await newClient.save()
    reply.code(201).send(newClient)
  } catch (error) {
    reply.code(500).send({ message: 'Error creating client', error })
  }
}

export const getClients = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const clients = await Client.find()
    reply.send(clients)
  } catch (error) {
    reply.code(500).send({ message: 'Error fetching clients', error })
  }
}
