import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth } from "../../middleware/auth.middleware.js";
import * as postController from "./controller/post.js";
import { validation } from "../../middleware/validation.middleware.js";
// import * as validators from "./post.validation.js"
import { endPoint } from "./post.endpoint.js";
const router = Router();


router.post("/", auth(endPoint.createPost),asyncHandler(postController.createPost));
router.get("/:id", auth(endPoint.createPost),asyncHandler(postController.getPost));
router.get("/:id", auth(endPoint.createPost),asyncHandler(postController.deletePost));



// router.get("/",asyncHandler(chatControllers.getAllChats))
// router.post('/',auth(endPoint.createChat),validation(validators.createChat), asyncHandler(chatControllers.createChat))
// router.get('/:userId',auth(endPoint.findUserChats),validation(validators.findUserChats),asyncHandler(chatControllers.findUserChats))
// router.get('/find/:firstId/:secondId',auth(endPoint.findChat),validation(validators.findChat),asyncHandler(chatControllers.findChat))
// router.get('/find/:chatId',auth(endPoint.findChat),validation(validators.findChatById),asyncHandler(chatControllers.findChatById))
// router.delete('/:chatId',auth(endPoint.deleteChat),validation(validators.deleteChat),asyncHandler(chatControllers.deleteChat))

export default router