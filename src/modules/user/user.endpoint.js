import { roles } from "../../middleware/auth.middleware.js"; 


export const endPoint = {
    getPostsOfOwner:[roles.Organization,roles.User, roles.Admin],
    me: [roles.Organization,roles.User, roles.Admin],
    getUser : [roles.Admin],
    updateUser : [roles.Admin],
    deleteUser : [roles.Admin]
}