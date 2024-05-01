import { nanoid } from "nanoid";
import postModel from "../../../../DB/models/Post.model.js";
import cloudinary from "../../../utils/coudinary.js";
import userModel from "../../../../DB/models/User.model.js";

export const getPostsOfSpecificUser = async (req, res, next) => {
  console.log(req.params);
  const checkUser = await userModel.findById(req.params.userId);
  if (!checkUser) {
    throw next(new Error("In-valid user Id", { cause: 404 }));
  }
  const posts = await postModel.find({ createdBy: req.params.userId });

  return res.status(200).json({ message: "success", posts });
};

export const getPostsOfOwner = async (req, res, next) => {
  const posts = await postModel.find({ createdBy: req.user._id });

  return res.status(200).json({ message: "success", posts });
};

export const createPost = async (req, res, next) => {
  console.log(req.user);
  console.log(JSON.stringify(req.user._id));
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
  const check = await postModel.findOne({ // Change each userId to _id If you want 
    _id: id,
    "likes.userId": regUser,
  });

  if (!check) {
    console.log("yes");
    await postModel.updateOne({_id:id}, { $addToSet: { likes: {userId:regUser} } });

    console.log(regUser);
    const updatedPost = await postModel.findById(id);
    console.log(updatedPost);
    return res.status(200).json({ message: "Added like", post: updatedPost });
  } else {
    console.log("no");
    await postModel.updateOne({_id:id}, {
      $pull: {
          likes: {
            userId: regUser
          }
      }
  });
    const updatedPost = await postModel.findById(id);
    return res.status(200).json({ message: "Removed like", post: updatedPost });
  }
};

export const deletePost = async (req, res, next) => {
  let id;
  if (req.params.id) {
    id = req.params.id;
  }
  if (!id) return next(new Error("No id found")); // Modification is done

  const doc = await postModel.findByIdAndDelete(id);
  if (!doc) {
    return next(new Error("No Document found with this id"));
  }
  res.status(204).json({
    message: "sucess",
    data: null,
  });
};
