import mongoose, { Schema, Document } from 'mongoose';

export interface IInsurance extends Document {
  clientId: mongoose.Types.ObjectId;
  type?: string;
  insurerName?: string;
  insuranceNo?: string;
  insuranceEmail?: string;
  claimNumber?: string;
  clerkRef?: string;
  assessor?: string;
  assessorEmail?: string;
  assessorNo?: string;
  assessorCompany?: string;
  warrantyStatus?: string;
  conditionStatus?: string;
}

const insuranceSchema = new Schema<IInsurance>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    type: String,
    insurerName: String,
    insuranceNo: String,
    insuranceEmail: String,
    claimNumber: String,
    clerkRef: String,
    assessor: String,
    assessorEmail: String,
    assessorNo: String,
    assessorCompany: String,
    warrantyStatus: String,
    conditionStatus: String,
  },
  { timestamps: true }
);

export default mongoose.model<IInsurance>('Insurance', insuranceSchema);
