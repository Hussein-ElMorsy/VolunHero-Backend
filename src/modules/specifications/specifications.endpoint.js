import { roles } from "../../middleware/auth.middleware.js"; 



export const endPoint = {
    getGeneral:[roles.User, roles.Organization, roles.Admin],
    getMedical : [roles.User, roles.Organization, roles.Admin],
    getEducational:[roles.User, roles.Organization, roles.Admin],
}