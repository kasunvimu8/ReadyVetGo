import mongoose from "mongoose";

mongoose.plugin((schema) => {
  if (schema.get("toJSON")) {
    // Custom toJSON settings already apply
    return;
  }

  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });
});
