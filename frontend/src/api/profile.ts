import { Profile } from "@/types/profile"
import { GET, POST, PUT } from "@/lib/http"
import { UserDocument } from "@/types/user.ts"

export const getProfile = async (profileId: string) => {
  return await GET<Profile>(`/profile/${profileId}`)
}

export const getUserProfile = async (): Promise<Profile> => {
  return await GET<Profile>("/profile")
}

export const getUserProfileByUserId = async (
  userId: string
): Promise<Profile> => {
  return await POST<Profile, { userId: string }>("/profile/user", {
    userId: userId,
  })
}

export const updateUserProfile = async (
  data: Partial<Profile>
): Promise<Profile> => {
  return await PUT<Profile, Partial<Profile>>(`/profile`, data)
}

export const assignDocumentToCurrentUser = async (doc: UserDocument) => {
  return await POST<void, UserDocument>(`/profile/assign-document`, doc)
}

export const getDocumentsOfUser = async (userId: string) => {
  return await GET<UserDocument[]>(`/profile/documents`, {
    params: {
      userId: userId,
    },
  })
}

export const deleteDocument = async (docId: string) => {
  return await POST<void, { docId: string }>(`/profile/delete-document`, {
    docId: docId,
  })
}
