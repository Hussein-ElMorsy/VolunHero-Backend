import { roles } from "../../middleware/auth.middleware.js"; 



export const endPoint = {
    getGeneral:[roles.User],
    getMedical : [roles.User], // Post
    getEducational:[roles.User],
}