import Client, { IClient } from '../models/clientModel'

class ClientService {
  async getAllClients(): Promise<IClient[]> {
    return await Client.find().lean()
  }

  async createClient(data: Partial<IClient>): Promise<IClient> {
    const client = new Client(data)
    return await client.save()
  }
}

export default new ClientService()
