import { roles } from "../../middleware/auth.middleware.js";



export const endPoint = {
    startMeeting:[roles.Organization,roles.User],
    checkMeetingExists:[roles.Organization,roles.User],
    getAllMeetingUsers:[roles.Organization,roles.User],
}