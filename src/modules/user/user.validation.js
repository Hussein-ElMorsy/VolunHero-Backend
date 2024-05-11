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
  userName: joi.string().min(2).max(25),
  email: generalFields.email,
  password: generalFields.password,
  cpassword: generalFields.cPassword,
  DOB: joi.date().max('now').custom((value, helpers) => {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      console.log(age);
      if (age < 18) {
          return helpers.message('Age must be more than 18 years old');
      }
      return value;
  }),
  role: generalFields.role,
  specification: generalFields.specification,
  file: joi.object({
      attachments: joi.array().items(generalFields.file).max(10),
  }),
  phone: generalFields.phone,
  gender: generalFields.gender,
  address: generalFields.address,
  overview: generalFields.overview,
  website: generalFields.website,
  headquarters: generalFields.headquarters,
  specialties: generalFields.specialties,
  locations: generalFields.locations,
}).required();

