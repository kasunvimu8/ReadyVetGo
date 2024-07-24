import { User, UserVerificationData } from "@/types/user"
import { GET, PUT } from "@/lib/http"
import { VetWithDocs } from "@/components/custom/verify-vet/VerifyVetTable.tsx"

export const fetchUsers = () => {
  return GET<User[]>("/users/all")
}

export const getVerifyVeterinarianData = () => {
  return GET<VetWithDocs[]>("/users/verify-vet")
}

export const updateVetVerification = (data: UserVerificationData) => {
  return PUT<{ message: string; status: string }, UserVerificationData>(
    "/users/verify-vet",
    data
  )
}

export const getCurrentUser = () => {
  return GET<User | NonNullable<unknown>>("/users/currentUser")
}
