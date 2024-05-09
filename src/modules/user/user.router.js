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




// elle fadel hena ---------
// 1 - update user profile pic , remove profile pic -|
//                                                    ------>  mafesh create 3ashan hn3ml patch bs 3la el user
// 2 - update user cover pic , remove cover pic     -| 

router.use("/:slugUserName/:userId/post",postRouter)


router.get("/me", auth(endPoint.me), userController.getMe,
  validation(validators.user), asyncHandler(userController.getUser));

router.delete("/deleteMe", auth(endPoint.me), userController.getMe,
  validation(validators.user), asyncHandler(userController.deleteMe));
  
router.patch("/updateMe", auth(endPoint.me), // Check again
  asyncHandler(userController.updateMe));

// get my following list
router.get("/following",auth(endPoint.getMyFollowings),asyncHandler(userController.getMyFollowings))


// get other user following list

router.get("/:slugUserName/:userId/following",auth(endPoint.getUserFollowings),asyncHandler(userController.getUserFollowings))


// get my followers list

router.get("/following",auth(endPoint.getMyFollowers),asyncHandler(userController.getMyFollowers))


// get other user followers list

router.get("/:slugUserName/:userId/followers",auth(endPoint.getUserFollowers),asyncHandler(userController.getUserFollowers))


// make follow and unfollow
// "Unfollow - Comments - Saved posts" - Home page - Data profile
router.patch("/:userId/makefollow",auth(endPoint.makeFollow),asyncHandler(userController.makeFollow))

router.patch("/:userId/makeunfollow",auth(endPoint.makeFollow),asyncHandler(userController.makeUnFollow))

router // Check api features again
  .route("/")
  .get(auth(endPoint.getUser), asyncHandler(userController.getUsers)); 

router
  .route("/:id")
  .get(auth(endPoint.getUser), validation(validators.user), asyncHandler(userController.getUser))
  .patch(auth(endPoint.updateUser), asyncHandler(userController.updateUser)) // Change it
  .delete(auth(endPoint.deleteUser), validation(validators.user), asyncHandler(userController.deleteUser));


export default router;
