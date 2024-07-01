import { roles } from "../../middleware/auth.middleware.js"; 



export const endPoint = {
    createChat : [roles.Organization,roles.User],
    findUserChats:[roles.Organization,roles.User],
    findChat:[roles.Organization,roles.User],
    deleteChat:[roles.Organization,roles.User],
    search: [roles.Organization, roles.User]
}