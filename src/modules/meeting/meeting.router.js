import { Router } from "express";
import * as meetingController from "./controller/meeting.js"
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth } from "../../middleware/auth.middleware.js";
import { endPoint } from "./meeting.endpoint.js";


const router = Router();


router.post("/start",meetingController.startMeeting)
router.get("/join",meetingController.checkMeetingExists)
router.get("/get",meetingController.getAllMeetingUsers)




export default router;