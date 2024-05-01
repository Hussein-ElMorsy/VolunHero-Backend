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
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        userId: {
          type: Types.ObjectId,
          ref: "User",
          required:true,
        },
      },
    ],
    // comments: [{
    //     userId: {
    //         type: Types.ObjectId,
    //         ref: "User",
    //     }
    // }]
    customId:String,
  },
  {
    timestamps: true,
  }
);

const postModel = mongoose.models.Post || model("Post", postSchema);
export default postModel;
