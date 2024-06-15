import mongoose, { Schema, Types, model } from "mongoose";

const commentSchema = new Schema(
  {
    content: String,
    // attachments: [Object],
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
    likesCount:{type:Number,default:0},
  },
  {
    timestamps: true,
  }
);

const commentModel = mongoose.models.Comment || model("Comment", commentSchema);
export default commentModel;
