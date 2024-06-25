import { Router } from "express";
import * as meetingController from "./controller/meeting.js"


const router = Router();


router.post("/start",meetingController.startMeeting)
router.get("/join",meetingController.checkMeetingExists)
router.get("/get",meetingController.getAllMeetingUsers)




export default router;