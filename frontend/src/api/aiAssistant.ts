import { POST } from "@/lib/http.ts"

export const getAnswerSuggestions = async (chatId: string) =>
  POST<string[], { chatId: string }>("/ai-assistant/response", {
    chatId: chatId,
  })
