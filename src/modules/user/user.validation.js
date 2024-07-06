import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";


export const user = joi.object({
  id:generalFields.id.required()
  }
).required();

export const updateProfilePic = joi.object({
  file: joi.object({
    profilePic:joi.array().items(generalFields.file.required()).length(1)
}).required(),
}).required();

export const updateCover = joi.object({
  file: joi.object({
    coverPic:joi.array().items(generalFields.file.required()).length(1)
}).required(),
}).required();


export const update = joi.object({
  firstName: joi.string().min(2).max(25),
  lastName: joi.string().min(2).max(25),
  phone: generalFields.phone,
  address: generalFields.address,
}).required();

export const updatePassword = joi.object({
  currentPassword: generalFields.password.required(),
  newPassword:  generalFields.password.required(),
}).required();

export const verifyPassword = joi.object({
  password: joi.string().required(),
}).required();

export const updateEmail = joi.object({
  email:  generalFields.email.required(),
}).required();
