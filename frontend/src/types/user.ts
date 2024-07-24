import { z } from "zod"

export enum Role {
  Farmer = "farmer",
  Vet = "vet",
  Admin = "admin",
}

export type User = {
  id: string
  email: string
  role: Role
  isEmailVerified: boolean
  isVerified: boolean
  profileId: string
  firstName: string
  lastName: string
  subscriptionActive: boolean
}

const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
})

// check if the object is a User
export function isUser(obj: any): obj is User {
  return UserSchema.safeParse(obj).success
}

export type UserProfile = {
  id: string
  email: string
  role: Role
  isVerified: boolean
  createdDate: Date
  subscriptionId?: string
}

export type UserVerificationData = {
  id: string
  isVerified: boolean
}

export type UserDocument = {
  path: string,
  title: string,
}
