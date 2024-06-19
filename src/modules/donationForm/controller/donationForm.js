import * as factory from "./../../../utils/handlerFactory.js";
import donationFormModel from "../../../../DB/models/DonationForm.model.js";
import mongoose from "mongoose";

export const createDonationForm = (req, res, next) => {
  console.log(req.user._id);
};
