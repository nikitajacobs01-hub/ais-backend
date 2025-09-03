import { Schema, model, Document, Types} from 'mongoose'

export interface IInsurance extends Document {
  type: string
  insurerName?: string
  insuranceNo?: string
  insuranceEmail?: string
  claimNumber?: string
  clerkRef?: string
  assessor?: string
  assessorEmail?: string
  assessorNo?: string
  assessorCompany?: string
  warrantyStatus?: string
  conditionStatus?: string
  clientId: Types.ObjectId
}

const insuranceSchema = new Schema<IInsurance>({
  type: { type: String, required: true },
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
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', unique: true, required: true }
})

export default model<IInsurance>('Insurance', insuranceSchema)
