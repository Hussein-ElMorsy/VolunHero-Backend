import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";


export const createDonationForm = joi.object({
  title:joi.string().required(),
  description:joi.string().required(),
  donationLink: generalFields.website.required(),
  endDate: joi.date().min('now').required(),
  createdBy:generalFields.id,
  }
).required();

export const updatedDonationForm = joi.object({
  title:joi.string(),
  description:joi.string(),
  donationLink: generalFields.website,
  endDate: joi.date().min('now'),
  createdBy:generalFields.id,
  id:generalFields.id.required()
  }
).required();

export const getDonationForms = joi.object({
  id:generalFields.id.required()
}).required()


export const deleteDonationForm = joi.object({
  id:generalFields.id.required()
}).required()