import mongoose, { Schema, Types, model } from "mongoose";

const savedPosts = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: "User"
        },
        posts:
          [{
            postId: {
                type: Types.ObjectId,
                ref: "Post",
            }
        }]
    },
    {
        timestamps: true,
    }

);

const savedPostsModel = mongoose.models.SavedPosts || model("SavedPosts", savedPosts);
export default savedPostsModel;
