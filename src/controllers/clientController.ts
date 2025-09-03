import { FastifyRequest, FastifyReply } from 'fastify';
import Client from '../models/clientModel';
import Vehicle from '../models/vehicleModel';
import Insurance from '../models/insuranceModel';
import Tow from '../models/towModel';
import { VehicleInput, InsuranceInput, TowInput, ClientCreateInput } from '../lib/types';

export const createClient = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const {
      vehicles,
      insurance,
      tow,
      insuranceType,
      towNeeded,
      ...clientData
    } = request.body as ClientCreateInput;

    // 1️⃣ Create client
    const client = await Client.create(clientData);

    // 2️⃣ Vehicles
    if (vehicles && vehicles.length > 0) {
      const vehiclesWithClient: (VehicleInput & { clientId: typeof client._id })[] =
        vehicles.map((v: VehicleInput) => ({ ...v, clientId: client._id }));
      await Vehicle.insertMany(vehiclesWithClient);
    }

    // 3️⃣ Insurance
    if (insuranceType === 'insurance' && insurance) {
      const insuranceWithClient: InsuranceInput & { clientId: typeof client._id } = {
        ...insurance,
        clientId: client._id,
      };
      await Insurance.create(insuranceWithClient);
    }

    // 4️⃣ Tow
    if (towNeeded === 'yes' && tow) {
      const towWithClient: TowInput & { clientId: typeof client._id } = {
        ...tow,
        clientId: client._id,
      };
      await Tow.create(towWithClient);
    }

    return reply.status(201).send({ client });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'Failed to create client' });
  }
};

export const getClients = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // Fetch all clients
    const clients = await Client.find().lean();

    // For each client, fetch vehicles, insurance, tow
    const clientsWithDetails = await Promise.all(
      clients.map(async (client) => {
        const vehicles = await Vehicle.find({ clientId: client._id }).lean();
        const insurance = await Insurance.findOne({ clientId: client._id }).lean();
        const tow = await Tow.findOne({ clientId: client._id }).lean();

        return {
          ...client,
          vehicles,
          insurance,
          tow,
        };
      })
    );

    return reply.status(200).send(clientsWithDetails);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'Failed to fetch clients' });
  }
};


export const getClientById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };

    // Fetch client
    const client = await Client.findById(id).lean();
    if (!client) return reply.status(404).send({ error: 'Client not found' });

    // Fetch nested data
    const vehicles = await Vehicle.find({ clientId: id }).lean();
    const insurance = await Insurance.findOne({ clientId: id }).lean();
    const tow = await Tow.findOne({ clientId: id }).lean();

    return reply.status(200).send({
      ...client,
      vehicles,
      insurance,
      tow,
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'Failed to fetch client' });
  }
};
