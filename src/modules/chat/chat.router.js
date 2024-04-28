import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as chatControllers from "./controller/chat.js"
import { auth } from "../../middleware/auth.middleware.js";
import { endPoint } from "./chat.endpoint.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./chat.validation.js"

const router = Router();

router.get("/",asyncHandler(chatControllers.getAllChats))
router.post('/',auth(endPoint.createChat),validation(validators.createChat), asyncHandler(chatControllers.createChat))
router.get('/:userId',auth(endPoint.findUserChats),validation(validators.findUserChats),asyncHandler(chatControllers.findUserChats))
router.get('/find/:firstId/:secondId',auth(endPoint.findChat),validation(validators.findChat),asyncHandler(chatControllers.findChat))
router.get('/find/:chatId',auth(endPoint.findChat),validation(validators.findChatById),asyncHandler(chatControllers.findChatById))
router.delete('/:chatId',auth(endPoint.deleteChat),validation(validators.deleteChat),asyncHandler(chatControllers.deleteChat))

export default router