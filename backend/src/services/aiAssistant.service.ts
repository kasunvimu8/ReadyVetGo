import { ChatDB } from "@models/chat.model";
import axios from "axios";
import {
  AIAssistantChatMessage,
  AnswerSuggestions,
  ChatSummery,
  OpenAIResponse,
} from "@interfaces/aiAssistant.interface";
import { BaseDataMedicalRecord } from "@models/medical-record";

/**
 * This function is used to make a request to the AI assistant.
 * see https://platform.openai.com/docs/api-reference/chat for more information
 * @param instruction the system instruction to be sent to the AI assistant
 * @param messages the messages to be sent to the AI assistant if index mod 2 == 0 then the message is from the user else from the AI assistant
 * @param model the model to be used for the request
 * @param responseFormat for openai use "json" to force the response to be in json format
 */
const openAiRequest = async (
  instruction: string,
  messages: AIAssistantChatMessage[],
  model: string = "gpt-4o",
  responseFormat?: {}
): Promise<string> => {
  const systemMessage = {
    role: "system",
    content: instruction,
  } as AIAssistantChatMessage; // using system message as extra argument to be compatible to code a and gemini
  messages = [systemMessage, ...messages];

  const apiUrl = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  };

  const data = {
    model: model,
    messages: messages,
    response_format: responseFormat,
  };

  const response = await axios
    .post(apiUrl, data, { headers })
    .catch((error) => {
      console.log(error);
      throw error;
    });
  const response_data = response.data as OpenAIResponse;
  return response_data.choices[0].message.content;
};

export const getAnswerSuggestions = async (chat: ChatDB): Promise<string[]> => {
  // todo a bit of prompt engineering might be needed here
  const systemMessage =
    "You are part of a online veterinary consultation." +
    ` Your job is to assist the veterinarian in Suggesting answers in the current chat consultation.` +
    ` All answers will be reviewed by the veterinarian before being sent to the farmer. Only suggest short answers.` +
    `only answer int th following Json format {answers: ["answer 1", "answer 2", ... ]}`;
  const messagesString = await chat.toMessageString();
  const message = {
    role: "user",
    content: `Here is the consultation so far. Please provide suggestions for the next message.\n\n ${messagesString}`,
  } as AIAssistantChatMessage;

  const response = await openAiRequest(
    systemMessage,
    [message],
    "gpt-3.5-turbo",
    { type: "json_object" }
  );
  const answerSuggestions = JSON.parse(response) as AnswerSuggestions;
  return answerSuggestions.answers;
};

export const summarizeChat = async (chat: ChatDB): Promise<ChatSummery> => {
  const systemMessage =
    "You are part of a online veterinary consultation." +
    ` Your job is to summarize the current chat consultation.` +
    ` Please provide a summary of the current chat consultation so far. Answer in the following Json format ` +
    `{title: "A Title for the Chat", summary: "Your summary"}`;
  const messagesString = await chat.toMessageString();
  const message = {
    role: "user",
    content: `Here is the consultation so far. Please provide a summary of the chat.\n\n ${messagesString}`,
  } as AIAssistantChatMessage;

  const response = await openAiRequest(
    systemMessage,
    [message],
    "gpt-4-turbo",
    { type: "json_object" }
  );
  return JSON.parse(response) as ChatSummery;
};

export const getPrefilledMedicalRecord = async (
  chat: ChatDB
): Promise<BaseDataMedicalRecord> => {
  const systemMessage = `You are part of an online veterinary consultation. Your job is to fill out the medical record for the current chat consultation.
   Use the provided JSON structure and ensure that the assessment, treatment, and plan text are descriptive. Sex can be either "Male" or "Female". dob should be
   string data and weight should be a number in kg. Format should be followed strictly and if specific data cannot be found, leave the corresponding value as an empty string.`;

  const jsonPrompt = {
    animalId: "Given animal ID",
    species: "Species Name",
    breed: "Breed Name",
    sex: "Male",
    dob: "2020-10-23",
    color: "Color",
    weight: 500,
    assessment: "Assessment description",
    treatment: "Recommended treatments",
    plan: "Future checkups or future assessments",
  };

  const messagesString = chat.messages
    .map((message) =>
      message.isSystem
        ? `system: "${message.messageText}"`
        : `${message.userID}: "${message.messageText}"`
    )
    .join("\n");

  const message = {
    role: "user",
    content: `Here is the consultation so far. Please fill out the medical record for the animal strictly following the format.
     If any information is unavailable, leave the corresponding field as an empty string:\n\n${JSON.stringify(jsonPrompt, null, 2)}\n\n${messagesString}`,
  } as AIAssistantChatMessage;

  const response = await openAiRequest(
    systemMessage,
    [message],
    "gpt-4-turbo",
    { type: "json_object" }
  );
  return JSON.parse(response) as BaseDataMedicalRecord;
};
