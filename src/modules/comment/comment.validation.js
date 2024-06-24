import joi from "joi"
import { generalFields } from "../../middleware/validation.middleware.js"



export const commentPost = joi.object({
    postId:generalFields.id.required(),
    content:joi.string().required(),

}).required()


export const getPostComments = joi.object({
    postId:generalFields.id.required(),

}).required()

export const deleteComment = joi.object({
    postId:generalFields.id.required(),
    commentId:generalFields.id.required(),
}).required()

export const getCommentById = joi.object({
    commentId:generalFields.id.required(),
}).required()


