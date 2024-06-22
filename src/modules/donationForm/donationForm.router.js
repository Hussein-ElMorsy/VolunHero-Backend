//CRUD operations and allowed only for oraganizations
import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth } from "../../middleware/auth.middleware.js";
import * as donationFormController from "./controller/donationForm.js";

const router = Router();

router
  .route("/")
  .get(asyncHandler(donationFormController.getAllDonationForms))
  .post(donationFormController.createDonationForm);

router
  .route("/:id")
  .get(asyncHandler(donationFormController.getDonationForm))
  .patch(asyncHandler(donationFormController.updateDonationForm))
  .delete(asyncHandler(donationFormController.deleteForm));

export default router;
