import mongoose, { Schema } from "mongoose";

export type UserDocument = {
  path: string;
  title: string;
}

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  nbDevicesOnline: number;  // 0 = offline, >0 = online to account for multiple devices being online
  lastSeenOnline?: Date;
  assignedDocuments?: UserDocument[];
  userId: string;
  bio: string;
};

const profileSchema: Schema = new Schema({
  profileImageUrl: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  nbDevicesOnline: { type: Number, required: true, default: 0},
  lastSeenOnline: { type: String },
  assignedDocuments: { type: [Object] },
  userId: { type: String, required: true, unique: true},
  bio: { type: String, default: ""}
});

const ProfileModel = mongoose.model<Profile>("Profile", profileSchema);
export default ProfileModel;
