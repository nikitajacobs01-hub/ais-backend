import Tow, { ITow } from '../models/towModel'

class TowService {
  async getAllTows(): Promise<ITow[]> {
    return await Tow.find().lean()
  }

  async createTow(data: Partial<ITow>): Promise<ITow> {
    const tow = new Tow(data)
    return await tow.save()
  }
}

export default new TowService()
