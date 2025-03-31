import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
    name: string;
    dateOfBirth: number;
    gender: number;
    email: string;
    address?: string;
}

const EmployeeSchema: Schema = new Schema({
    name: { type: String, required: true },
    dateOfBirth: { type: Number, required: true },
    gender: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String },
},
    { strict: true }
);

export default mongoose.model<IEmployee>("Employee", EmployeeSchema);
