import { Router } from "express";
import * as authController from "../auth/controller/auth.js";
import * as userController from "./Controller/userController.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "../auth/auth.validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
const router = Router();

router.use(asyncHandler(authController.protect));
// router.get('/', asyncHandler(userController.getUserModule)); //for testing
router.get("/me", userController.getMe, asyncHandler(userController.getUser));

router.delete("/deleteMe", asyncHandler(userController.deleteMe));
router.patch("/updateMe", asyncHandler(userController.updateMe));
// router.patch('/updateMe',
//     userController.uploadUserPhoto,
//     userController.resizeUserPhoto,
//     userController.updateMe
// );

router.use(userController.restrictTo("Admin"));

router // Check api features again
  .route("/")
  .get(asyncHandler(userController.getUsers))
  .post(asyncHandler(userController.createUser)); // Necessary ?

router
  .route("/:id")
  .get(asyncHandler(userController.getUser))
  .patch(asyncHandler(userController.updateUser))
  .delete(asyncHandler(userController.deleteUser));
export default router;
