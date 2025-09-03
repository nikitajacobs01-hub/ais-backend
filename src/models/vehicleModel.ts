import { Schema, model, Document, Types } from 'mongoose'

export interface IVehicle extends Document {
  registration: string
  vin: string
  engineNo: string
  make: string
  modelName: string // renamed from 'model'
  odometer: string
  colour: string
  bookingDate: Date
  quoteDate: Date
  clientId: Types.ObjectId
}

const vehicleSchema = new Schema<IVehicle>({
  registration: { type: String, required: true },
  vin: { type: String, required: true },
  engineNo: { type: String, required: true },
  make: { type: String, required: true },
  modelName: { type: String, required: true }, // renamed here too
  odometer: { type: String, required: true },
  colour: { type: String, required: true },
  bookingDate: { type: Date, required: true },
  quoteDate: { type: Date, required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true }
})

export default model<IVehicle>('Vehicle', vehicleSchema)
