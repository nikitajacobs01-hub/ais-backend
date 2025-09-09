import mongoose, { Schema, Document } from 'mongoose';

export interface IAccidentLink extends Document {
  token: string;
  clientName: string;
  clientEmail?: string;
  clientPhone: string;
  used: boolean;
  expiresAt: Date;
}

const accidentLinkSchema = new Schema<IAccidentLink>({
  token: { type: String, required: true, unique: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String },
  clientPhone: { type: String, required: true },
  used: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model<IAccidentLink>('AccidentLink', accidentLinkSchema);
