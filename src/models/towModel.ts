import { Schema, model, Document, Types } from 'mongoose'

export interface ITow extends Document {
  towedBy?: string
  towContact?: string
  towEmail?: string
  towingFee?: string
  clientId: Types.ObjectId
}

const towSchema = new Schema<ITow>({
  towedBy: String,
  towContact: String,
  towEmail: String,
  towingFee: String,
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', unique: true, required: true }
})

export default model<ITow>('Tow', towSchema)
