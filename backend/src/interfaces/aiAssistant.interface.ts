
export interface AIAssistantChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/*the expected response from open Ai*/
export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    }
    logprobs: any;
    finish_reason: string;
  }[];
}

export interface ChatSummery {
  title: string;
  summary: string;
}

export interface AnswerSuggestions {
  answers: string[];
}