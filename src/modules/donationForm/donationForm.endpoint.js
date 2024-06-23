import { roles } from "../../middleware/auth.middleware.js"; 



export const endPoint = {
    createDonationForm:[roles.Organization, roles.Admin],
    updateDonationForm: [roles.Organization, roles.Admin],
    deleteDonationForm: [roles.Organization, roles.Admin],
    getDonationForms: [roles.Organization, roles.Admin, roles.User],

}