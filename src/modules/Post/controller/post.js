import { nanoid } from "nanoid";
import postModel from "../../../../DB/models/Post.model.js";
import cloudinary from "../../../utils/coudinary.js";
import userModel from "../../../../DB/models/User.model.js";
import ProfileDataModel from "../../../../DB/models/ProfileData.model.js";
import commentModel from "../../../../DB/models/Comment.model.js";
import { createNotification, deleteNotification } from "../../../utils/notification.js";

// const posts = await postModel.aggregatePostss();

export const getAllPosts = async (req, res, next) => {
  const posts = await postModel.find().populate([
    {
      path: "createdBy",
      select: "userName profilePic role",
    },
  ]);

  console.log({ posts });

  const modifiedPosts = posts.map((post) => {
    const { likes, sharedUsers, ...rest } = post.toObject();
    return rest;
  });

  return res.status(200).json({ message: "success", modifiedPosts });
};

//  get post by id

export const getPostById = async (req, res, next) => {
  const { id } = req.params;
  const post = await postModel.findById(id).populate([
    {
      path: "createdBy",
      select: "userName profilePic role",
    },
  ]);
  if (!post) {
    return next(new Error("In-valid postId", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", post });
};

// get home page posts

export const getHomePagePosts = async (req, res, next) => {
  const user = await userModel.findById(req.user._id).select("following");
  const followingIds = user.following.map((follow) => follow.userId._id);

  // Find posts created by the users the current user is following
  let posts = await ProfileDataModel.find({ userId: { $in: followingIds } })
    .populate({
      path: "post",
    })
    .sort({ createdAt: -1 });

  return res.status(200).json({ message: "success", posts });
};

// get profile posts

export const getPostsOfSpecificUser = async (req, res, next) => {
  console.log(req.params);
  const checkUser = await userModel.findById(req.params.userId);
  if (!checkUser) {
    throw next(new Error("In-valid user Id", { cause: 404 }));
  }
  const posts = await ProfileDataModel.find({ userId: req.params.userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "userId",
      select: "userName profilePic role",
    })
    .populate({
      path: "post",
    });

  return res.status(200).json({ message: "success", posts });
};

export const getPostsOfOwner = async (req, res, next) => {
  // const posts = await postModel.aggregatePosts(req.user._id);
  // let posts = await postModel.aggregate([
  //   {
  //     $match: { createdBy: (req.user._id) }
  //   },
  //   {
  //     $addFields: {
  //       likesCount: { $size: "$likes" },
  //       sharedCount: { $size: "$sharedUsers" }
  //     }
  //   },
  //   {
  //     $project: {
  //       likes:0,
  //       sharedUsers:0
  //     }
  //   }
  // ]);

  let posts = await ProfileDataModel.find({ userId: req.user._id })
    .sort({ createdAt: -1 }).populate({
      path: "post",
      populate: {
        path: 'createdBy', 
        select: 'userName profilePic role' 
      }
    });

  console.log({posts});
  posts = posts.map((post) => {
    const postObj = post?.post?.toObject() ?? {};
    const { likes, sharedUsers, ...rest } = postObj;
    return rest;
    
    // if (likes !== undefined && sharedUsers !== undefined) {
    //   return rest;
    // } else {
    //   // Handle cases where likes or sharedUsers do not exist
    //   return {
    //     ...rest,
    //     likes: likes ?? null,
    //     sharedUsers: sharedUsers ?? null
    //   };
    // }
  });
  // console.log({posts});
  return res.status(200).json({ message: "success", posts });
};

export const createPost = async (req, res, next) => {
  // console.log(req.user);
  // console.log(JSON.stringify(req.user._id));

  req.body.createdBy = req.user._id;
  req.body.attachments = [];
  if (req?.files && req?.files?.attachments) {
    req.body.customId = nanoid();
    await Promise.all(
      req.files.attachments.map(async (file) => {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          file.path,
          { folder: `${process.env.APP_NAME}/post/${req.body.customId}` }
        );
        req.body.attachments.push({ secure_url, public_id });
      })
    );
  }
  const post = await postModel.create(req.body);
  const addToProfile = new ProfileDataModel();
  (addToProfile.userId = req.user._id), (addToProfile.post = post._id);
  await addToProfile.save();
  return res.status(201).json({ message: "success", post });
};

export const updatePost = async (req, res, next) => {
  // first check post for login user
  const { id } = req.params;
  const checkUserPost = await postModel.findOne({
    createdBy: req.user._id,
    _id: id,
  });

  if (!checkUserPost) {
    throw next(new Error("In-valid post", { cause: 404 }));
  }

  if (req.files?.attachments?.length) {
    req.body.attachments = [];
    const customId = checkUserPost.customId || nanoid();
    for (const file of req.files.attachments) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: `${process.env.APP_NAME}/post/${customId}` }
      );
      // await cloudinary.uploader.destroy(file.public_id)
      req.body.attachments.push({ secure_url, public_id });
    }
  }

  const post = await postModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).select('-sharedFrom');

  return res.status(200).json({ message: "success", post });
};

// export const getPost = async (req, res, next) => {
//   let query = postModel.findById(req.params.id);
//   if (popOptions) query.populate(popOptions);

//   const doc = await query;

//   if (!doc) {
//     return next(new Error(`No doc Found with this id`, 404));
//   }
//   res.status(200).json({
//     message: "success",
//     requestedAt: req.requestTime,
//     data: {
//       doc,
//     },
//   });
// };

export const likePost = async (req, res, next) => {
  const { id } = req.params;

  const regUser = req.user._id;
  const checkPostFound = await postModel.findById(id);
  if (!checkPostFound)
    return next(new Error("In-valid Post Id", { cause: 404 }));

  const check = await postModel.findOne({
    // Change each userId to _id If you want
    _id: id,
    "likes.userId": regUser,
  });

  if (!check) {
    console.log("yes");
    await postModel.findByIdAndUpdate(id, {
      $addToSet: { likes: { userId: regUser } },
      $inc: { likesCount: 1 },
    });
    const updatedPost = await postModel.findById(id);
    console.log(updatedPost);

    if(!createNotification({user:checkPostFound.createdBy,type:"like",sender:req.user._id,content:`${req.user.userName} liked your post.`, relatedEntity:id, entityModel:"Post"})){
      return next(new Error("failed to send Notification", { cause: 400 }));
    }

    return res.status(200).json({ message: "Added like", post: updatedPost });
  } else {
    console.log("no");
    await postModel.findByIdAndUpdate(id, {
      $pull: {
        likes: {
          userId: regUser,
        },
      },
      $inc: { likesCount: -1 },
    });
    if(!deleteNotification({relatedEntity:id,type:"like"})){
      return next(new Error("failed to delete Notification", { cause: 400 }));
    }
    const updatedPost = await postModel.findById(id);
    return res.status(200).json({ message: "Removed like", post: updatedPost });
  }
};

// export const commentPost = async (req, res, next) => {
//   req.body.createdBy = req.user._id;

//   const comment = await commentModel.create(req.body);

//   const { id } = req.params;
//   const updatedPost = await postModel.findByIdAndUpdate(id, {
//     $push: { comments: { commentId: comment._id, } },
//     $inc: { commentCount: 1 },
//   },
//   { new: true } 
// );
// if(!updatePost){
//     return res.status(404).json({message: "No post with this id"});
//   }
//   return res.status(200).json({ message: "Comment added", comment: comment });
// }


export const deletePost = async (req, res, next) => {
  const { id } = req.params;
  const checkUserPost = await postModel.findOne({
    createdBy: req.user._id,
    _id: id,
    sharedFrom: null
  });

  if (!checkUserPost) return next(new Error("In-valid post")); // Modification is done
  
  // Find all shared posts that have this post as their `sharedFrom`
  const sharedPostIds = await postModel.find({ mainPost: id });

  console.log(sharedPostIds);

  // Delete all posts from ProfileDataModel associated with `id` or `sharedPostIds`
  await ProfileDataModel.deleteMany({
      post: { $in: sharedPostIds } 
  });

  await postModel.deleteMany({ mainPost: id });

  const doc = await postModel.findByIdAndDelete(id);

  await ProfileDataModel.findOneAndDelete({ post: id, userId: req.user._id });
  
  // if (!doc) {
  //   return next(new Error("No Document found with this id"));
  // }
  
  return res.status(204).json({ message: "success" });
};

export const sharePost = async (req, res, next) => {
  const { id } = req.params;
  const regUser = req.user._id;
  // const modifiedContent = req.body.content;
  const checkPost = await postModel.findById(id);

  if (!checkPost) return next(new Error("In-valid Post Id", { cause: 404 }));

  const updatedPost = await postModel.findByIdAndUpdate(id, {
    $push: { sharedUsers: { userId: regUser } },
    $inc: { shareCount: 1 },},
    {
    new: true
    }
);
  // const updatedPost = await postModel.findById(id);
  let mainPostId = updatedPost._id
  
  if(updatedPost.mainPost != null){
    mainPostId = updatedPost.mainPost;
  }

  const newPost = await postModel.create({
    mainPost: mainPostId, // For delete + main cotent
    content: updatedPost.content,
    attachments: updatedPost.attachments,
    createdBy: regUser,
    sharedFrom: updatedPost._id
  });
  const addToProfile = new ProfileDataModel();
  // (addToProfile.userId = req.user._id), (addToProfile.post = updatedPost._id);
  (addToProfile.userId = req.user._id), (addToProfile.post = newPost._id);
  await addToProfile.save();
  return res.status(200).json({ message: "Post shared", post: newPost });
};

export const removeSharedPost = async (req, res, next) => {
  const { id } = req.params;
  const regUser = req.user._id;
  const checkPost = await postModel.findById(id);

  if (!checkPost) return next(new Error("In-valid Post Id", { cause: 404 }));

  const checkShare = await postModel.findOne({
    // Change each userId to _id If you want
    _id: id,
  });

  if (!checkShare || checkShare.sharedFrom == null)
    return next(new Error("can not remove this shared post", { cause: 400 }));

  await postModel.findByIdAndUpdate(checkPost.sharedFrom, {
    $pull: {
      sharedUsers: {
        userId: regUser,
        // _id:sharedId
      },
    },
    $inc: { shareCount: -1 },
  });


  await ProfileDataModel.findOneAndDelete({ post: id, userId: req.user._id });

  const updatedPost = await postModel.findByIdAndDelete(id);
  return res.status(200).json({ message: "Removed Post" });
};
