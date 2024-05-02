import { Router } from "express";
import * as authController from "../auth/controller/auth.js";
import * as userController from "./Controller/userController.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./user.validation.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { endPoint } from "./user.endpoint.js";
import postRouter from "../Post/post.router.js"
import { auth } from "../../middleware/auth.middleware.js";
const router = Router();


router.use("/:slugUserName/:userId/post",postRouter)


router.get("/me", auth(endPoint.me), userController.getMe,
  validation(validators.user), asyncHandler(userController.getUser));

router.delete("/deleteMe", auth(endPoint.me), userController.getMe,
  validation(validators.user), asyncHandler(userController.deleteMe));
  
router.patch("/updateMe", auth(endPoint.me), // Check again
  asyncHandler(userController.updateMe));


router // Check api features again
  .route("/")
  .get(auth(endPoint.getUser), asyncHandler(userController.getUsers))

router
  .route("/:id")
  .get(auth(endPoint.getUser), validation(validators.user), asyncHandler(userController.getUser))
  .patch(auth(endPoint.updateUser), asyncHandler(userController.updateUser)) // Change it
  .delete(auth(endPoint.deleteUser), validation(validators.user), asyncHandler(userController.deleteUser));
export default router;
