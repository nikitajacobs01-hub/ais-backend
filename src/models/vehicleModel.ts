import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
  clientId: mongoose.Types.ObjectId;
  registration: string;
  vin: string;
  engineNo: string;
  make: string;
  modelName: string;
  odometer: string;
  colour: string;
  bookingDate?: string;
  quoteDate?: string;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    registration: String,
    vin: String,
    engineNo: String,
    make: String,
    modelName: String,
    odometer: String,
    colour: String,
    bookingDate: String,
    quoteDate: String,
  },
  { timestamps: true }
);

export default mongoose.model<IVehicle>('Vehicle', vehicleSchema);
