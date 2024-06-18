import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import { auth } from "../../middleware/auth.middleware.js";
import * as postController from "./controller/post.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as validators from "./post.validation.js"
import { endPoint } from "./post.endpoint.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import commentRouter from "../comment/comment.router.js"

const router = Router({mergeParams:true});

router.use("/:postId/comment", commentRouter);

// elle na2s 
// 3ayzen kol ma ngeb el posts n4of elle 3aml login 3aml like lel post abl keda wala la w nrg3o
// fe attrebute "isLikedByMe"




router.get("/allposts",asyncHandler(postController.getAllPosts)); // All posts 

router.get("/",asyncHandler(postController.getPostsOfSpecificUser)); // using slug-name :)

router.get("/ownerPosts", auth(endPoint.getPostsOfOwner),asyncHandler(postController.getPostsOfOwner)); // Post of logged in user

router.get("/homePage", auth(endPoint.getHomePagePosts), asyncHandler(postController.getHomePagePosts)) // Home page Posts

router.get("/:id",auth(endPoint.getPostById),validation(validators.getPostById),asyncHandler(postController.getPostById))
router.post("/", auth(endPoint.createPost),fileUpload(fileValidation.image).fields([
    {name:"attachments",maxCount:100},
]),validation(validators.createPost),asyncHandler(postController.createPost));

router.put("/:id",auth(endPoint.updatePost),fileUpload(fileValidation.image).fields([
    {name:"attachments",maxCount:100},
]),validation(validators.updatePost),asyncHandler(postController.updatePost));


router.patch("/:id/like",auth(endPoint.likePost),validation(validators.likePost),asyncHandler(postController.likePost));


// router.get("/:id", auth(endPoint.createPost),asyncHandler(postController.getPost));
router.delete("/:id", auth(endPoint.createPost),validation(validators.deletePost),asyncHandler(postController.deletePost));

router.patch("/:id/share",auth(endPoint.sharePost),validation(validators.sharePost),asyncHandler(postController.sharePost))
router.patch("/:id/removeShare",auth(endPoint.sharePost),validation(validators.sharePost),asyncHandler(postController.removeSharedPost))


router.get("/:id/likes",auth(endPoint.getPostLikes),validation(validators.getPostLikes),asyncHandler(postController.getPostLikes));



// -------------- 
// router.post("/:id/comment",auth(endPoint.commentPost),validation(validators.commentPost),asyncHandler(postController.commentPost));

// router.get("/",asyncHandler(chatControllers.getAllChats))
// router.post('/',auth(endPoint.createChat),validation(validators.createChat), asyncHandler(chatControllers.createChat))
// router.get('/:userId',auth(endPoint.findUserChats),validation(validators.findUserChats),asyncHandler(chatControllers.findUserChats))
// router.get('/find/:firstId/:secondId',auth(endPoint.findChat),validation(validators.findChat),asyncHandler(chatControllers.findChat))
// router.get('/find/:chatId',auth(endPoint.findChat),validation(validators.findChatById),asyncHandler(chatControllers.findChatById))
// router.delete('/:chatId',auth(endPoint.deleteChat),validation(validators.deleteChat),asyncHandler(chatControllers.deleteChat))

export default router