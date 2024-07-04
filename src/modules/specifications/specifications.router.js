import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as spectificationsController from "./controller/specifications.js"
import { auth } from "../../middleware/auth.middleware.js";
import { endPoint } from "./spectifications.endpoint.js";
import { validation } from "../../middleware/validation.middleware.js";

const router = Router();



router.get('/',auth(endPoint.getGeneral),asyncHandler(messageController.getMessages));

export default router