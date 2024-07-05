import { nanoid } from "nanoid";
import postModel from "../../../../DB/models/Post.model.js";
import cloudinary from "../../../utils/coudinary.js";
import userModel from "../../../../DB/models/User.model.js";
import ProfileDataModel from "../../../../DB/models/ProfileData.model.js";
import commentModel from "../../../../DB/models/Comment.model.js";
import { createNotification, deleteNotification } from "../../../utils/notification.js";
import savedPostsModel from "../../../../DB/models/SavedPosts.model.js";

// const posts = await postModel.aggregatePostss();

export const getAllPosts = async (req, res, next) => {
  const posts = await postModel.find()
    .populate([
      {
        path: "createdBy",
        select: "userName profilePic role",
      },
      {
        path: "sharedBy",
        select: "userName profilePic role",
      }
    ]);

  const modifiedPosts = posts.map((post) => {
    const postObj = post.toObject();
    let isLikedByMe = null;
    if(post.likes != null){
    isLikedByMe = postObj.likes.some(
      like => like.userId.toString() == req.user._id.toString() 
      );
    }
    postObj.isLikedByMe = isLikedByMe;
    return postObj;
  });

  return res.status(200).json({ message: "success", modifiedPosts });
};

//  get post by id

export const getPostById = async (req, res, next) => {
  const { id } = req.params;
  let post = await postModel.findById(id)
    .populate([
      {
        path: "createdBy",
        select: "userName profilePic role",
      },
      {
        path: "sharedBy",
        select: "userName profilePic role",
      }
  ]);
  if (!post) {
    return next(new Error("In-valid postId", { cause: 404 }));
  }

  post = post.toObject();

  let isLikedByMe = null;
  if(post.likes != null){
  isLikedByMe = post.likes.some(
    like => like.userId.toString() == req.user._id.toString() 
    );
  }
  post.isLikedByMe = isLikedByMe;
  console.log(post)
  
  return res.status(200).json({ message: "success", post });
};

// get home page posts

export const getHomePagePosts = async (req, res, next) => {
  const user = await userModel.findById(req.user._id).select("following");
  const followingIds = user.following.map((follow) => follow.userId._id);

  // Find posts created by the users the current user is following
  let posts = await ProfileDataModel.find({ userId: { $in: followingIds } })
  .sort({ createdAt: -1 })
  .populate({
    path: "post",
    populate: [
      // {
      //   path: "mainPost",
      //   // populate: {
      //   //   path: "createdBy",
      //   //   select: "userName profilePic role",
      //   // },
      // },
      {
        path: "createdBy",
        select: "userName profilePic role",
      },
      {
        path: "sharedBy",
        select: "userName profilePic role",
      },
    ],
  });
    // console.log(posts);
    posts = posts.map(post => {
      const postObj = post.post.toObject();

      const isLikedByMe = postObj.likes.some(like => like.userId.toString() === req.user._id.toString());

      postObj.isLikedByMe = isLikedByMe;

      return postObj;
    });

  
  return res.status(200).json({ message: "success", posts });
};

// get profile posts

export const getPostsOfSpecificUser = async (req, res, next) => {
  console.log(req.params);
  const checkUser = await userModel.findById(req.params.userId);
  if (!checkUser) {
    throw next(new Error("In-valid user Id", { cause: 404 }));
  }
  let posts = await ProfileDataModel.find({ userId: req.params.userId })
  .sort({ createdAt: -1 })
  .populate({
    path: "post",
    populate: [
      {
        path: "createdBy",
        select: "userName profilePic role",
      },
      {
        path: "sharedBy",
        select: "userName profilePic role",
      },
    ],
  });
  posts = posts.map((post) => { // Added 
    const postObj = post?.post?.toObject() ?? {};

    const isLikedByMe = postObj.likes.some(like => like.userId.toString() === req.user._id.toString());

    postObj.isLikedByMe = isLikedByMe;
    return postObj;
}); 
  return res.status(200).json({ message: "success", posts });
};

export const getPostsOfOwner = async (req, res, next) => {
  let posts = await ProfileDataModel.find({ userId: req.user._id })
  .sort({ createdAt: -1 })
  .populate({
    path: "post",
    populate: [
      // {
      //   path: "mainPost",
      //   // populate: {
      //   //   path: "createdBy",
      //   //   select: "userName profilePic role",
      //   // },
      // },
      {
        path: "createdBy",
        select: "userName profilePic role",
      },
      {
        path: "sharedBy",
        select: "userName profilePic role",
      },
    ],
  });


  console.log({ posts });
  posts = posts.map((post) => {
    const postObj = post?.post?.toObject() ?? {};
    const isLikedByMe = postObj.likes.some(like => like.userId.toString() === req.user._id.toString());

    postObj.isLikedByMe = isLikedByMe;
    return postObj;

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
  let post = await postModel.create(req.body);
  const addToProfile = new ProfileDataModel();
  (addToProfile.userId = req.user._id), (addToProfile.post = post._id);
  await addToProfile.save();

  console.log(post)

  post = await postModel.findById(post._id)
  .populate([
    {
      path: "createdBy",
      select: "userName profilePic role",
    },
    {
      path: "sharedBy",
      select: "userName profilePic role",
    }
  ]);

  post = post.toObject();

  let isLikedByMe = null;
  if(post.likes != null){
  isLikedByMe = post.likes.some(
    like => like.userId.toString() == req.user._id.toString() 
    );
  }
  post.isLikedByMe = isLikedByMe;

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

  let post = await postModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
  post = post.toObject();

  let isLikedByMe = null;
  if(post.likes != null){
  isLikedByMe = post.likes.some(
    like => like.userId.toString() == req.user._id.toString() 
    );
  }
  post.isLikedByMe = isLikedByMe;

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
    let updatedPost = await postModel.findById(id)
      .populate([
        {
          path: "createdBy",
          select: "userName profilePic role",
        },
        {
          path: "sharedBy",
          select: "userName profilePic role",
        }
      ]);;
    console.log(updatedPost);

    if (!createNotification({ user: checkPostFound.createdBy, type: "like", sender: req.user._id, content: `${req.user.userName} liked your post.`, relatedEntity: id, entityModel: "Post" })) {
      return next(new Error("failed to send Notification", { cause: 400 }));
    }
    updatedPost = updatedPost.toObject();
    updatedPost.isLikedByMe = true;
    

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
    if (!deleteNotification({ relatedEntity: id, type: "like" })) {
      return next(new Error("failed to delete Notification", { cause: 400 }));
    }
    let updatedPost = await postModel.findById(id)
    .populate([
      {
        path: "createdBy",
        select: "userName profilePic role",
      },
      {
        path: "sharedBy",
        select: "userName profilePic role",
      }
    ]);;
    updatedPost = updatedPost.toObject();
    updatedPost.isLikedByMe = false;
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

  const sharedPostIds = await postModel.find({ mainPost: id });

  console.log(sharedPostIds);

  await ProfileDataModel.deleteMany({
    post: { $in: sharedPostIds }
  });


    await savedPostsModel.updateOne( // Added
      { userId: req.user._id },
      { $pull: { posts: { postId: id } } }
    );

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
    $inc: { shareCount: 1 },
  },
    {
      new: true
    }
  );
  // const updatedPost = await postModel.findById(id);
  let mainPostId = updatedPost._id

  if (updatedPost.mainPost != null) {
    mainPostId = updatedPost.mainPost;
  }
  const createdById = await postModel.findById(mainPostId).select('createdBy');
  console.log(createdById)

  const newPost = await postModel.create({
    mainPost: mainPostId, // For delete + main cotent
    content: updatedPost.content,
    attachments: updatedPost.attachments,
    createdBy: createdById.createdBy,
    sharedBy: regUser,
    sharedFrom: updatedPost._id
  });

  const addToProfile = new ProfileDataModel();
  // (addToProfile.userId = req.user._id), (addToProfile.post = updatedPost._id);
  (addToProfile.userId = req.user._id), (addToProfile.post = newPost._id);
  await addToProfile.save();

  let newPostRes = await postModel.findById(newPost._id).populate([
    {
      path: "createdBy",
      select: "userName profilePic role",
    },
    {
      path: "sharedBy",
      select: "userName profilePic role",
    }
  ]);

  newPostRes = newPostRes.toObject();

  let isLikedByMe = null;
  if(newPostRes.likes != null){
  isLikedByMe = newPostRes.likes.some(
    like => like.userId.toString() == req.user._id.toString() 
    );
  }
  newPostRes.isLikedByMe = isLikedByMe;

  return res.status(200).json({ message: "Post shared", post: newPostRes });
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

export const searchPost = async (req, res, next) =>{
  const searchRegex = new RegExp(req.body.content, 'i');
  let posts = await postModel.find({content: searchRegex})
  .sort({ createdAt: -1 })
  .populate([
    {
      path: "createdBy",
      select: "userName profilePic role",
    },
    {
      path: "sharedBy",
      select: "userName profilePic role",
    }
  ])

  posts = posts.map((post) => {
    const postObj = post.toObject();
    let isLikedByMe = null;
    if(post.likes != null){
    isLikedByMe = postObj.likes.some(
      like => like.userId.toString() == req.user._id.toString() 
      );
    }
    postObj.isLikedByMe = isLikedByMe;
    return postObj;
  });

  return res.status(200).json({message: "success", posts});
}

export const getPostLikes = async (req, res, next) =>{
  const postId = req.params.id;

  const post = await postModel.findById(postId).select('likes');
  if (!post) {
    return next(new Error("In-valid postId", { cause: 404 }));
  }
  const userIds = post.likes.map(like => like.userId);
  const users = await userModel.find({ _id: { $in: userIds } })
  .select("-password -status -confirmEmail -forgetCode -changePasswordTime -createdAt")
    return res.status(200).json({ message: "success", users });
} 