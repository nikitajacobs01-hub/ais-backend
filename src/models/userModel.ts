import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  status: string
  role: string
  createdAt: Date
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, default: 'pending' }, // pending, approved, rejected
  role: { type: String, default: 'user' }, // user or admin
  createdAt: { type: Date, default: Date.now }
})

export default model<IUser>('User', userSchema)
