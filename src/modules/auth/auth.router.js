import { Router } from "express";
import * as authController from './controller/auth.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../Middleware/validation.middleware.js";
import * as validators from "./auth.validation.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
const router = Router();
router.get("/",authController.getAuthModule);

router.post('/signUp',fileUpload(fileValidation.image).single('image'),validation(validators.signUp),asyncHandler(authController.signUp))
router.get("/confirmEmail/:token",validation(validators.token),asyncHandler(authController.confirmEmail))
router.get('/newConfirmEmail/:token',validation(validators.token),asyncHandler(authController.newConfirmEmail))
router.post('/login',validation(validators.login),asyncHandler(authController.login))
router.patch('/sendCode',validation(validators.sendCode),asyncHandler(authController.sendCode));
router.put('/forgetPassword',validation(validators.forgetPassword),asyncHandler(authController.forgetPassword));


export default router;