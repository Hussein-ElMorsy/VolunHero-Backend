import joi from "joi"
import { generalFields } from "../../middleware/validation.middleware.js"


export const createMessage = joi.object({
    chatId:generalFields.id,
    senderId:generalFields.id, 
    text:joi.string()

}).required()

export const getMessages = joi.object({
    chatId:generalFields.id,
}).required()

export const deleteMessage = joi.object({
    messageId:generalFields.id,
}).required()