// models/accidentModel.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAccident extends Document {
    clientName: string;
    clientEmail?: string;
    clientPhone: string;
    vehicleMake: string;
    vehicleModel: string;
    accidentLocation: { lat: number; lng: number; address: string };
    insuranceCompany?: string;
    description?: string;
    status: 'pending' | 'assigned' | 'completed';
    towCompanyAssigned?: string;
    carRegistrationImage?: string; // number plate
    accidentImages?: string[];     // max 4
}

const accidentSchema = new Schema<IAccident>(
    {
        clientName: { type: String, required: true },
        clientEmail: { type: String },
        clientPhone: { type: String, required: true },
        vehicleMake: { type: String, required: true },
        vehicleModel: { type: String, required: true },
        accidentLocation: {
            lat: { type: Number },
            lng: { type: Number },
            address: { type: String },
        },
        insuranceCompany: { type: String },
        description: { type: String },
        status: {
            type: String,
            enum: ['pending', 'assigned', 'completed'],
            default: 'pending',
        },
        towCompanyAssigned: { type: String },

        // NEW
        carRegistrationImage: { type: String, required: false },
        accidentImages: [{ type: String, required: false }],
    },
    { timestamps: true }
);

export default mongoose.model<IAccident>('Accident', accidentSchema);
