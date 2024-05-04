import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";

// content: String,
//     specification: {
//       // Check again
//       type: String,
//       required: function () {
//         return this.role === "User";
//       },
//       default: "General",
//       enum: ["General", "Medical", "Educational"],
//     },
//     attachments: [Object],
//     createdBy: {
//       type: Types.ObjectId,
//       ref:

export const createPost = joi.object({

    content:joi.string().required(),
    type:generalFields.specification,
    file: joi.object({
        attachments: joi.array().items(generalFields.file).max(100),
    }),
    createdBy:generalFields.id,
    
    }
).required();


export const updatePost = joi.object({

    content:joi.string(),
    type:generalFields.specification,
    file: joi.object({
        attachments: joi.array().items(generalFields.file).max(100),
    }),
    id:generalFields.id.required()
    }
).required();


export const likePost = joi.object({
    id:generalFields.id.required()
    }
).required();
export const getPostById = joi.object({
    id:generalFields.id.required()
    }
).required();


export const deletePost = joi.object({
    id:generalFields.id.required()
}).required()


export const sharePost = joi.object({
    id:generalFields.id.required()
}).required()


