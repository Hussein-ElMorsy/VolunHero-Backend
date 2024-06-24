import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoint } from "./notifications.endpoint.js";
import { validation } from "../../middleware/validation.middleware.js";
import *  as validators from "./notifications.validation.js"
import * as notificationsController from "./controller/notifications.js"
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router();



// get notifications of login user

router.get("/",auth(endPoint.getNotifications),asyncHandler(notificationsController.getNotifications));

router.patch("/:notificationId/read",auth(endPoint.readNotification),asyncHandler(notificationsController.readNotification))

// update notification status (read:false -> read:true)





export default router;