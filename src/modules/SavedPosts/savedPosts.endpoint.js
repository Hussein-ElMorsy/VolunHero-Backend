import { roles } from "../../middleware/auth.middleware.js"; 



export const endPoint = {
    getSavedPosts:[roles.Organization,roles.User, roles.Admin],
    savePost : [roles.Organization,roles.User, roles.Admin], // Post
    deleteSavedPost:[roles.Organization,roles.User, roles.Admin],
}