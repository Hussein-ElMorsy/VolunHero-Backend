import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth } from "../../middleware/auth.middleware.js";
import * as savedPostsController from "./controller/savedPostsController.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./savedPosts.validation.js"
import { endPoint } from "./savedPosts.endpoint.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";

const router = Router({mergeParams:true});

router.post("/:id",auth(endPoint.savePost),validation(validators.savePost),asyncHandler(savedPostsController.savePost))
router.get("/",auth(endPoint.getSavedPosts),asyncHandler(savedPostsController.getSavedPosts))
router.delete("/:id",auth(endPoint.deleteSavedPost),validation(validators.deleteSavedPost),asyncHandler(savedPostsController.deleteSavedPost))

export default router;