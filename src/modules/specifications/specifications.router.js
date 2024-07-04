import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as spectificationsController from "./controller/specifications.js"
import { auth } from "../../middleware/auth.middleware.js";
import { endPoint } from "./specifications.endpoint.js";
import { validation } from "../../middleware/validation.middleware.js";

const router = Router();



router.get('/:specification',auth(endPoint.getGeneral),asyncHandler(spectificationsController.getUsers));



export default router