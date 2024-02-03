import { Router } from "express";
import * as authController from "./controller/auth.js";
import { asyncHandler } from "../../utils/errorHandling.js";


const router = Router();


router.post('/signUp',asyncHandler(authController.signUp));
router.post('/login',asyncHandler(authController.login));

export default router;