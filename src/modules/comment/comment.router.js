import { Router } from "express";
import { endPoint } from "./comment.endpoint.js";
import * as validators from "./comment.validation.js"
import * as commentController from "./controller/comment.js"
import { validation } from "../../middleware/validation.middleware.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth } from "../../middleware/auth.middleware.js";


const router = Router({mergeParams:true});

router.get("/",validation(validators.getPostComments),asyncHandler(commentController.getPostComments));
router.get("/:commentId",validation(validators.getCommentById),asyncHandler(commentController.getCommentById))
// add media in post
router.post("/",auth(endPoint.commentPost),validation(validators.commentPost),asyncHandler(commentController.commentPost));
router.delete("/:commentId",auth(endPoint.deleteComment),validation(validators.deleteComment),commentController.deleteComment);


// get comment by id and return all post - >>> vertual population





export default router;