import mongoose, { Schema, model, Types } from "mongoose";

const donationFormSchema = new Schema({
  title: {
    type: String,
    required: [true, "Form Title cannot be empty!"],
  },
  announceDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  description: {
    type: String,
    trim: true,
  },
  donationLink: {
    type: String,
    required: [true, "Form Link cannot be empty!"],
  },
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
  },
});

const donationFormModel =
  mongoose.models.DonationForm || model("DonationForm", donationFormSchema);

export default donationFormModel;
