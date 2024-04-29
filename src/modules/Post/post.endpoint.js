import { roles } from "../../middleware/auth.middleware.js"; 



export const endPoint = {
    createPost : [roles.Organization,roles.User, roles.Admin],
    // findUserChats:[roles.Organization,roles.User],
    findPost:[roles.Organization,roles.User, roles.Admin],
    deletePost:[roles.Organization,roles.User,roles.Admin],
}