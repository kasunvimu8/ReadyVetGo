import mongoose, { Schema } from "mongoose";
import { Role } from "@interfaces/user.interface";

export interface User extends Document {
  id: string;
  email: string;
  password: string;
  role: Role;
  createdDate: Date;
  isVerified?: boolean;
  isEmailVerified: boolean;
  emailChallenge?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  // Methods to control the data that is sent to the frontend
  toFEUserProfile: () => {
    id: string;
    email: string;
    role: Role;
    isVerified?: boolean;
    createdDate: Date;
    isEmailVerified: boolean;
  };
  toFEUser: () => {
    id: string;
    email: string;
    role: Role;
    isEmailVerified: boolean;
  };
}

const userSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: Role },
  isVerified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  emailChallenge: { type: String, required: false },
  createdDate: { type: Date, required: true },
  resetPasswordToken: { type: String, required: false },
  resetPasswordExpires: { type: Date, required: false },
});

/**
 * Converts the user document to a plain JavaScript object representing the user's response data.
 * This method is intended to format user data for sending as a response after login or registration.
 *
 * @returns {Object} The user's response data, including id, email, role, and verification status.
 */
userSchema.methods.toFEUserProfile = function () {
  const { id, email, role, isVerified, createdDate, isEmailVerified } =
    this as User;
  return { id, email, role, isVerified, createdDate, isEmailVerified };
};

/**
 * Converts the user document to a plain JavaScript object representing the user's response data.
 * This method is intended to format user data for sending as a response after login or registration.
 *
 * @returns {Object} The user's response data, including id, email, and role.
 */
userSchema.methods.toFEUser = function () {
  const { id, email, role, isEmailVerified } = this as User;
  return { id, email, role, isEmailVerified };
};

const UserModel = mongoose.model<User>("User", userSchema);
export default UserModel;
