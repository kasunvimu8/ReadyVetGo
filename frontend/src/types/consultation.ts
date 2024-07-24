export enum LiveStatus {
  ONLINE = "online",
  OFFLINE = "offline",
}

export type ChatUser = {
  id: string
  username: string
  status: LiveStatus
}
