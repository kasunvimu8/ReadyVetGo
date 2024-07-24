import { Profile } from "./profile"

export enum SEX {
  male = "Male",
  female = "Female",
}

export const defaultValues: MedicalRecordPayload = {
  animalId: "",
  species: "",
  breed: "",
  sex: SEX.male,
  dob: "",
  color: "",
  weight: 0,
  assessment: "",
  treatment: "",
  plan: "",
}

export interface MedicalRecordPayload {
  animalId: string
  species: string
  breed: string
  sex: SEX
  dob: string
  color: string
  weight: number
  assessment: string
  treatment: string
  plan: string
  farmerId?: string
}

export type MedicalRecord = MedicalRecordPayload & {
  id: string
  createdBy?: Profile
  farmer?: Profile
  createdDate?: string
  farmerName?: string
  vetName?: string
}
