import { nanoid } from "nanoid";
import postModel from "../../../../DB/models/Post.model.js";
import cloudinary from "../../../utils/coudinary.js";
import userModel from "../../../../DB/models/User.model.js";
import ProfileDataModel from "../../../../DB/models/ProfileData.model.js";

// const posts = await postModel.aggregatePostss();

export const getAllPosts = async (req, res, next) => {

  const posts = await postModel.find().populate(
    [{
      path: 'createdBy',
      select: 'userName profilePic role'
    }
  ]);

  const modifiedPosts = posts.map(post => {
    const { likes, sharedUsers, ...rest } = post.toObject();
    return rest;
  });


  return res.status(200).json({ message: "success", modifiedPosts })

}




//  get post by id

export const getPostById = async (req, res, next) => {

  const { id } = req.params;
  const post = await postModel.findById(id);
  if (!post) {
    return next(new Error("In-valid postId", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", post });
}

// get profile posts 

export const getPostsOfSpecificUser = async (req, res, next) => {
  console.log(req.params);
  const checkUser = await userModel.findById(req.params.userId);
  if (!checkUser) {
    throw next(new Error("In-valid user Id", { cause: 404 }));
  }
  const posts = await postModel.find({
    $or: [
      { createdBy: req.params.userId },
      { "sharedUsers.userId": req.params.userId }
    ]
  });



  return res.status(200).json({ message: "success", posts });
};

export const getPostsOfOwner = async (req, res, next) => {

  const posts = await postModel.aggregatePosts(req.user._id);
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
  console.log({ posts });

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
  const addToProfile = new ProfileDataModel;
  addToProfile.userId = req.user._id,
    addToProfile.post = post._id
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
  });

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
  if (!checkPostFound) return next(new Error("In-valid Post Id", { cause: 404 }));

  const check = await postModel.findOne({ // Change each userId to _id If you want 
    _id: id,
    "likes.userId": regUser,
  });

  if (!check) {
    console.log("yes");
    await postModel.findByIdAndUpdate(id, { $addToSet: { likes: { userId: regUser } } });
    const updatedPost = await postModel.findById(id);
    console.log(updatedPost);
    return res.status(200).json({ message: "Added like", post: updatedPost });
  } else {
    console.log("no");
    await postModel.findByIdAndUpdate(id, {
      $pull: {
        likes: {
          userId: regUser
        }
      }
    });
    const updatedPost = await postModel.findById(id);
    return res.status(200).json({ message: "Removed like", post: updatedPost });
  }



}




export const deletePost = async (req, res, next) => {

  const { id } = req.params;
  const checkUserPost = await postModel.findOne({ createdBy: req.user._id, _id: id });

  if (!checkUserPost) return next(new Error("In-valid post")); // Modification is done

  const doc = await postModel.findByIdAndDelete(id);
  if (!doc) {
    return next(new Error("No Document found with this id"));
  }
  return res.status(204).json({ message: "success" });
};




export const sharePost = async (req, res, next) => {


  const { id } = req.params;
  const regUser = req.user._id;
  const checkPost = await postModel.findById(id);

  if (!checkPost) return next(new Error("In-valid Post Id", { cause: 404 }));


  await postModel.findByIdAndUpdate(id, { $push: { sharedUsers: { userId: regUser } } });
  const updatedPost = await postModel.findById(id);
  console.log(updatedPost);
  const addToProfile = new ProfileDataModel;
  addToProfile.userId = req.user._id,
  addToProfile.post = updatedPost._id;
  await addToProfile.save();
  return res.status(200).json({ message: "Post shared", post: updatedPost });


}



export const removeSharedPost = async (req, res, next) => {

  const { id } = req.params;
  const regUser = req.user._id;
  const checkPost = await postModel.findById(id);

  if (!checkPost) return next(new Error("In-valid Post Id", { cause: 404 }));

  const checkShare = await postModel.findOne({ // Change each userId to _id If you want 
    _id: id,
    "sharedUsers.userId": regUser,
  });

  if (!checkShare) return next(new Error("can not remove post", { cause: 400 }));

  await postModel.findByIdAndUpdate(id, {
    $pull: {
      sharedUsers: {
        userId: regUser,
        // _id:sharedId
      }
    }
  })

  const updatedPost = await postModel.findById(id);
  return res.status(200).json({ message: "Removed Post", post: updatedPost });
}

