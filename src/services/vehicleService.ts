import Vehicle, { IVehicle } from '../models/vehicleModel'

class VehicleService {
  async getAllVehicles(): Promise<IVehicle[]> {
    return await Vehicle.find().lean()
  }

  async createVehicle(data: Partial<IVehicle>): Promise<IVehicle> {
    const vehicle = new Vehicle(data)
    return await vehicle.save()
  }
}

export default new VehicleService()
