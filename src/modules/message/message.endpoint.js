import { roles } from "../../middleware/auth.middleware.js";



export const endPoint = {
    createMessage:[roles.Organization,roles.User],
    getMessages:[roles.Organization,roles.User],
    deleteMessage:[roles.Organization,roles.User],
}