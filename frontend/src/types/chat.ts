export enum ChatStatus {
  OPEN = "OPEN", // no vet assigned yet
  CLOSED = "CLOSED", // consultation is over now mor messaging possible
  ONGOING = "ONGOING", // vet is assigned and consultation is ongoing
}

export const SYSTEM_USER_ID = "system"

export type ChatParticipant = {
  id: string // user id
  name: string
}

export type ChatMessage = {
  messageText: string
  sendBy: string // user id || 'system'
}

export type ChatMessageSent = ChatMessage & {
  chatID: string
}

export type Chat = {
  id: string
  participants: ChatParticipant[]
  chatStatus: ChatStatus
  chatSummaryTitle?: string
  chatSummaryText?: string
  chatMessages?: ChatMessage[] // only prided be some endpoints to reduce data transfer
  createdDate?: Date
}

export type ChatMessageReceived = {
  message: ChatMessage
  chat?: Chat
}

export type ChatSummary = {
  id: string
  chatSummaryText: string
  chatSummaryTitle: string
  createdDate: string
}
