import mongoose, { Schema } from "mongoose";

export enum ConsultationState {
  Pending = "pending",
  Ongoing = "ongoing",
  Completed = "completed",
}

export type Message = {
  messageId: string;
  senderProfileId: string;
  messageContent: string;
  timeStamp: Date;
};

export type Consultation = {
  id: string;
  farmerProfileId: string;
  veterinarianProfileId: string;
  startTime: Date;
  endTime: Date;
  consultationState: ConsultationState;
  messages: Message[];
};

const messageSchema = new Schema(
  {
    messageId: { type: String, required: true },
    senderProfileId: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    messageContent: { type: String, required: true },
    timeStamp: { type: Date, required: true },
  },
  { _id: false }
);

const consultationSchema: Schema = new Schema({
  farmerProfileId: { type: String, required: true, unique: true },
  veterinarianProfileId: { type: String, required: true, unique: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  consultationState: {
    type: String,
    required: true,
    enum: ConsultationState,
  },
  messages: { type: [messageSchema], required: true, default: [] },
});

const ConsultationModel = mongoose.model<Consultation>(
  "Consultation",
  consultationSchema
);
export default ConsultationModel;
