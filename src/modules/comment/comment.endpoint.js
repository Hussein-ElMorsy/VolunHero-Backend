import { roles } from "../../middleware/auth.middleware.js"; 



export const endPoint = {
    
    commentPost:[roles.Organization,roles.User,roles.Admin],
    deleteComment:[roles.Organization,roles.User,roles.Admin]
}

