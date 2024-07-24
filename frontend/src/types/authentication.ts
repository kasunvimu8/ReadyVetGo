import { Role } from "@/types/user.ts"

/** Possible pages in the authentication flow */
export enum AuthPage {
  LOGIN = 1,
  SELECT_REGISTRATION_TYPE = 2,
  REGISTER = 3,
  UPLOAD_DOCUMENTS = 4,
  FORGOTPASSWORD = 5,
}

/** Possible registration types */
export enum RegistrationType {
  VETERINARIAN = 1,
  CLIENT = 2,
}

export const registrationTypeToUserRole = (
  registrationType: RegistrationType
): Role => {
  switch (registrationType) {
    case RegistrationType.VETERINARIAN:
      return Role.Vet
    case RegistrationType.CLIENT:
      return Role.Farmer
  }
}

/** info for the registration of a new user */
export type RegisterUser = {
  email: string
  role: Role
  password: string
  firstName: string
  lastName: string
  subscriptionStatus?: boolean
}

/** info for the login of a user */
export type LoginUser = {
  email: string
  password: string
}

/** state for the authentication cards */
export type AuthCardsState = {
  authPage?: AuthPage
  registrationType?: RegistrationType
}

export type EmailVerificationResponse = {
  status: string
  message: string
  data: {
    email: string
    isEmailVerified: boolean
  }
}
