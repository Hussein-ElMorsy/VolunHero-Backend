//CRUD operations and allowed only for oraganizations
import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth } from "../../middleware/auth.middleware.js";
import * as donationFormController from "./controller/donationForm.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./donationForm.validation.js"
import { endPoint } from "./donationForm.endpoint.js";

const router = Router();

router
  .route("/")
  .get(auth(endPoint.getDonationForms),asyncHandler(donationFormController.getAllDonationForms))
  .post(auth(endPoint.createDonationForm),validation(validators.createDonationForm),asyncHandler(donationFormController.createDonationForm));

router
  .route("/:id")
  .get(auth(endPoint.getDonationForms),validation(validators.getDonationForms) ,asyncHandler(donationFormController.getDonationForm))
  .patch(auth(endPoint.updateDonationForm), validation(validators.updatedDonationForm), asyncHandler(donationFormController.updateDonationForm))
  .delete(auth(endPoint.deleteDonationForm), validation(validators.deleteDonationForm), asyncHandler(donationFormController.deleteDonationForm));

  router
  .route("/org/:id")
  .get(auth(endPoint.getDonationForms),validation(validators.getDonationForms),asyncHandler(donationFormController.getDonationFormOfSpecificOrg))

export default router;
