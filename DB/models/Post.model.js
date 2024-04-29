import mongoose, { Schema, Types, model } from "mongoose";

const postSchema = new Schema(
  {
    content: String,
    specification: {
      // Check again
      type: String,
      required: function () {
        return this.role === "User";
      },
      default: "General",
      enum: ["General", "Medical", "Educational"],
    },
    attachments: [Object],
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    Likes: [
      {
        userId: {
          type: Types.ObjectId,
          ref: "User",
        },
      },
    ],
    // comments: [{
    //     userId: {
    //         type: Types.ObjectId,
    //         ref: "User",
    //     }
    // }]
  },
  {
    timestamps: true,
  }
);

const postModel = mongoose.models.Post || model("Post", postSchema);
export default postModel;
