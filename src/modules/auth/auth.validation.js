import joi from "joi";
import {generalFields} from "../../Middleware/validation.middleware.js"

export const signUp = joi.object({

    firstName:joi.string().min(2).max(25),
    lastName:joi.string().min(2).max(25),
    userName:joi.string().min(2).max(25).required(),
    email:generalFields.email.required(),
    password:generalFields.password.required(),
    cpassword:generalFields.cPassword.required(),
    DOB: joi.date()
    .max('now')
    .custom((value, helpers) => {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      console.log(age);
      if (age < 18) {
        return helpers.message('Age must be more than 18 years old');
      }
      return value;
    }),
    file:generalFields.file,
    phone:generalFields.phone,
    gender:generalFields.gender,
    address:generalFields.address,


}).required();

export const token=joi.object({
  token:joi.string().required(),
}).required()

export const login = joi.object({
  email:generalFields.email.required(),
  password:generalFields.password.required(),
}).required()


export const forgetPassword = joi.object({
  email:generalFields.email.required(),
  password:generalFields.password.required(),
  cPassword:generalFields.cPassword.required(),
  code:joi.string().pattern(new RegExp(/^[0-9]{4}$/)).min(4).max(4).required()
}).required()

export const sendCode = joi.object({
  email:generalFields.email.required(),
}).required()