import mongoose, { Schema, Document } from "mongoose";
import ProfileModel, { Profile } from "@models/profile.model";

export enum ChatStatus {
  OPEN = "OPEN", // no vet assigned yet
  CLOSED = "CLOSED", // consultation is over, no more messaging possible
  ONGOING = "ONGOING" // vet is assigned, and consultation is ongoing
}

export const SYSTEM_USER_ID = "system";

export interface IChatMessageFE {
  messageText: string;
  sendBy: string; // user id || 'system'
}

export interface IChatParticipantFE {
  id: string; // user id
  name: string;
}

export interface IChatMessageReceived extends IChatMessageFE {
  chatID: string;
}

export interface IChatMessageDB {
  messageText: string;
  isSystem: boolean;
  timestamp: Date;
  userID?: string;
}

export interface IChatFE {
  id: string;
  participants: IChatParticipantFE[];
  chatStatus: ChatStatus;
  chatMessages?: IChatMessageFE[];
  chatSummaryTitle?: string;
  chatSummaryText?: string;
  createdDate?: Date;
}

export type ChatDB = Document & {
  id: string;
  participants: string[];
  chatStatus: ChatStatus;
  messages: IChatMessageDB[];
  chatSummaryTitle?: string;
  chatSummaryText?: string;
  createdDate?: Date;
  toIChatMessagesFE: () => IChatMessageFE[];
  toIChatFE: () => Promise<IChatFE>;
  toIChatFEWithoutMessages: () => Promise<IChatFE>;
  toMessageString: () =>  Promise<string>;
}

const chatSchema: Schema = new Schema({
  _id: { type: String, required: true},
  participants: [{ type: String, required: true }],
  chatStatus: { type: String, required: true, enum: ChatStatus , index: true},  // index for faster search
  messages: [{
    messageText: { type: String, required: true },
    isSystem: { type: Boolean, required: true },
    userID: { type: String, required: false },
    timestamp: { type: Date, required: true }
  }],
  createdDate: { type: Date, required: true, default: Date.now },
  chatSummaryTitle: { type: String, required: false},
  chatSummaryText: { type: String, required: false}
});

/**
 * Converts a chat document into a list of chat messages that can be sent to the frontend.
 */
chatSchema.methods.toIChatMessagesFE = function(): IChatMessageFE[] {
  return this.messages.map((message: any) => {
    let sendBy: string;

    if (message.isSystem) {
      sendBy = SYSTEM_USER_ID;
    } else {
      sendBy = message.userID;
    }
    return {
      messageText: message.messageText,
      sendBy: sendBy
    };
  });
};

/**
 * Converts a chat document into a chat object that can be sent to the frontend.
 */
chatSchema.methods.toIChatFE = async function(): Promise<IChatFE> {
  const data: IChatFE = await this.toIChatFEWithoutMessages();
  data.chatMessages = this.toIChatMessagesFE();
  return data;
}

/**
 * Converts a Chat document into a chat object that can be sent to the frontend but without the messages.
 */
chatSchema.methods.toIChatFEWithoutMessages = async function(): Promise<IChatFE> {

  const participatingProfiles = await ProfileModel.find({ userId: { $in: this.participants } }).exec();
  const participants: IChatParticipantFE[] = this.participants.map((participant: string) => {
    const profile = participatingProfiles.find((profile: Profile) => profile.userId === participant);
    return {
      id: participant,
      name: profile ? `${profile.firstName} ${profile.lastName}` : 'Unknown User'
    };
  });

  return {
    id: this.id,
    participants: participants,
    chatStatus: this.chatStatus,
    chatSummaryText: this.chatSummaryText,
    chatSummaryTitle: this.chatSummaryTitle,
    createdDate: this.createdDate
  };
}

/**
 * Converts a chat in to a human-readable string.
 */
chatSchema.methods.toMessageString = async function(): Promise<string> {
  const feChat = await this.toIChatFE() as IChatFE;
  if (!feChat.chatMessages) {
    return `Chat ${this.id} has no messages.`;
  }
  return feChat.chatMessages.map(
    (chatMessage: { sendBy: any; messageText: any; }): string => {
      const sender = chatMessage.sendBy === SYSTEM_USER_ID ? "system" :
        feChat.participants.find((participant: IChatParticipantFE) => participant.id === chatMessage.sendBy)?.name;
      return `${sender}: "${chatMessage.messageText}"`;
    }).join("\n");
}

const ChatModel = mongoose.model<ChatDB>("Chat", chatSchema);
export default ChatModel;
