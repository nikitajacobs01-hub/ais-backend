import { Schema, model, Document } from 'mongoose'

export interface IClient extends Document {
  firstName: string
  lastName: string
  idNumber: string
  dob: Date
  email: string
  street: string
  suburb: string
  city: string
}

const clientSchema = new Schema<IClient>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  idNumber: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  street: { type: String, required: true },
  suburb: { type: String, required: true },
  city: { type: String, required: true }
})

export default model<IClient>('Client', clientSchema)
