import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";


export const savePost = joi.object({
  id:generalFields.id.required()
}).required();

export const deleteSavedPost = joi.object({
  id:generalFields.id.required()
}).required();