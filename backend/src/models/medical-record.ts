import { Schema, model } from "mongoose";

export enum SEX {
  male = "Male",
  female = "Female",
}

export type BaseDataMedicalRecord = {
  animalId: string;
  farmerId: string;
  species: string;
  breed: string;
  sex: SEX;
  dob: Date;
  color: string;
  weight: number;
  assessment: string;
  treatment: string;
  plan: string;
};

export type MedicalRecord = BaseDataMedicalRecord & {
  createddDate: Date;
  createdBy: string;
};

const medicalRecordSchema = new Schema({
  animalId: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String },
  sex: { type: String, enum: SEX, required: true },
  dob: { type: Date, required: true },
  color: { type: String },
  weight: { type: Number },
  assessment: { type: String, required: true },
  treatment: { type: String, required: true },
  plan: { type: String, required: true },
  createdDate: { type: Date },
  farmer: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
});

medicalRecordSchema.pre("save", function (next) {
  this.set({ createdDate: new Date() });
  next();
});

const MedicalRecord = model<MedicalRecord>(
  "MedicalRecord",
  medicalRecordSchema
);

export default MedicalRecord;
