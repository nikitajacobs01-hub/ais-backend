import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  firstName: string;
  lastName: string;
  idNumber: string;
  dob: string;
  email: string;
  street: string;
  suburb: string;
  city: string;
}

const clientSchema = new Schema<IClient>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    idNumber: { type: String, required: true },
    dob: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    suburb: { type: String, required: true },
    city: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IClient>('Client', clientSchema);
