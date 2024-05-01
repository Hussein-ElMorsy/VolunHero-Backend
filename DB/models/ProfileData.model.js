import mongoose, { Schema, Types, model } from "mongoose";

const profileData = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: "User"
        },
        post:
        {
            type: Types.ObjectId,
            ref: "Post",
            required: true,

        },

    },
    {
        timestamps: true,
    }
);

const ProfileDataModel = mongoose.models.ProfileData || model("ProfileData", profileData);
export default ProfileDataModel;
