import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { CmsPage, CmsPageState, CmsPageType } from "@interfaces/cms.interface";

const cmsComponentSchema = new Schema({
  _id: { type: String, default: uuidv4 }, // Using UUIDs instead of ObjectIDs here as the components get generated from the FE
  type: { type: String, required: true },
  content: { type: Schema.Types.Mixed, required: true },
});

const cmsPostSchema = new Schema(
  {
    title: { type: String, required: true },
    relativeUrl: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    thumbnailUrl: { type: String, required: false },
    postedDate: { type: Date },
    lastEditedDate: { type: Date },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    authorFeedback: {
      type: String,
      required: false,
    },
    hasAuthorReadFeedback: {
      type: Boolean,
      required: false,
    },
    state: {
      type: String,
      required: true,
      enum: CmsPageState,
    },
    type: {
      type: String,
      required: true,
      enum: CmsPageType,
    },
    cmsComponents: { type: [cmsComponentSchema], required: true, default: [] },
  },
  { strict: true }
);

cmsPostSchema.pre("save", function (next) {
  this.set({ lastEditedDate: new Date() });
  next();
});

cmsPostSchema.pre("findOneAndUpdate", function (next) {
  this.set({ lastEditedDate: new Date() });
  next();
});

const CmsPostModel = mongoose.model<CmsPage>("CmsPost", cmsPostSchema);
export default CmsPostModel;
