import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";



export const createChat = joi.object({

    // firstId:generalFields.id.required(),
    secondId:generalFields.id.required(),

}).required()

export const findUserChats = joi.object({

    // userId:generalFields.id.required(),

}).required()

export const findChat = joi.object({

    firstId:generalFields.id.required(),
    secondId:generalFields.id.required(),

}).required()

export const findChatById = joi.object({

    chatId:generalFields.id.required(),
}).required()



export const deleteChat = joi.object({

    chatId:generalFields.id.required(),

}).required()