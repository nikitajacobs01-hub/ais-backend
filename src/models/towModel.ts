import mongoose, { Schema, Document } from 'mongoose';

export interface ITow extends Document {
  clientId: mongoose.Types.ObjectId;
  towedBy?: string;
  towContact?: string;
  towEmail?: string;
  towingFee?: string;
}

const towSchema = new Schema<ITow>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    towedBy: String,
    towContact: String,
    towEmail: String,
    towingFee: String,
  },
  { timestamps: true }
);

export default mongoose.model<ITow>('Tow', towSchema);
