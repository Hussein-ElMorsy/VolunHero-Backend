import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as messageController from "./controller/message.js"
import { auth } from "../../middleware/auth.middleware.js";
import { endPoint } from "./message.endpoint.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./message.validation.js"

const router = Router();



router.post('/',auth(endPoint.createMessage),validation(validators.createMessage),asyncHandler(messageController.createMessage));
router.get('/:chatId',auth(endPoint.getMessages),validation(validators.getMessages),asyncHandler(messageController.getMessages));
router.delete('/:messageId',auth(endPoint.deleteMessage),validation(validators.deleteMessage),asyncHandler(messageController.deleteMessage))
export default router