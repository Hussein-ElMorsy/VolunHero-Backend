import { roles } from "../../middleware/auth.middleware.js"; 



export const endPoint = {
    getNotifications:[roles.Organization,roles.User, roles.Admin],
    readNotification:[roles.Organization,roles.User, roles.Admin],
}