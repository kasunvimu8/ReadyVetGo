export type Profile = {
  id?: string
  userId: string
  firstName: string
  lastName: string
  email: string
  profileImageUrl?: string
  nbDevicesOnline?: number
  lastSeenOnline?: Date
  bio: string  // short self description
}
