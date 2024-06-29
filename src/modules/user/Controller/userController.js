
import * as factory from "./../../../utils/handlerFactory.js"
import userModel from "../../../../DB/models/User.model.js";
import mongoose from "mongoose";
import cloudinary from "../../../utils/coudinary.js"
import { createNotification, deleteNotification } from "../../../utils/notification.js";
import { user } from "../user.validation.js";
import { compare, hashText } from "../../../utils/hashAndComare.js";


export const getUserModule = async (req, res, next) => {
  return res.json({ message: "user controller" });
}
export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
}
export const getUser = factory.getOne(userModel);


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}
export const updateMe = (async (req, res, next) => {
  // console.log(req.file) // for uploading

  // 1) Create error if user POSTs password data 
  if (req.body.password || req.body.passwordConfirm) { // Not confirmed yet
    return next(new Error(
      `This route is not for password updates. please use /updateMyPassword`, 400));
  };
  // 2) Flitered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'email');
  if (req.file) filteredBody.photo = req.file.filename

  // 3) Update user document                                               
  const updatedUser = await userModel.findByIdAndUpdate(req.user.id, filteredBody, {  // findByIdAndUpdate won't use middlewares in Model "NO NEED TO ENCRYPT PASSWORDS"
    new: true,
    runValidators: true
  })
  res.status(200).json({
    status: 'success',
    user: updatedUser
  });
});

export const updatePassword = async (req, res, next) => {

  const {currentPassword, newPassword} = req.body;
  const user = await userModel.findById(req.user._id);
  if (!compare({ plaintext: currentPassword, hashValue: user.password })) {
    return next(new Error("In-valid password", { cause: 400 }));
  }

  const hashPassword = hashText({ plaintext: newPassword });
  user.changePasswordTime = Date.now();
  user.password = hashPassword;
  await user.save();
  return res.status(200).json({
    status: 'success',
    user: user
  })
};

export const deleteMe = (async (req, res, next) => { // Not sure
  let id;
  if (req.user.id) {
    id = req.user.id
  }
  if (!id) return next(new Error("No id found")) // Modification is done

  const doc = await userModel.findByIdAndDelete(id);
  if (!doc) {
    return next(new Error("No Document found with this id"));
  }
  res.status(204).json({
    status: "sucess",
    data: null,
  });
});

export const updateProfilePic = (async (req, res, next) =>{
    if(req?.files?.profilePic){
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.profilePic[0].path, { folder: `${process.env.APP_NAME}/user` })
        req.body.profilePic = { secure_url, public_id };
    }
    const updatedUser = await userModel.findByIdAndUpdate(req.user.id, req.body, {  // findByIdAndUpdate won't use middlewares in Model "NO NEED TO ENCRYPT PASSWORDS"
      new: true,
      runValidators: true
    })
    
    res.status(200).json({
      status: "sucess",
      data: updatedUser
    })
})

export const updateCoverPic = (async (req, res, next) =>{
  if(req?.files?.coverPic){
      const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.coverPic[0].path, { folder: `${process.env.APP_NAME}/user` })
      req.body.coverPic = { secure_url, public_id };
  }
  const updatedUser = await userModel.findByIdAndUpdate(req.user.id, req.body, {  // findByIdAndUpdate won't use middlewares in Model "NO NEED TO ENCRYPT PASSWORDS"
    new: true,
    runValidators: true
  })
  
  res.status(200).json({
    status: "sucess",
    data: updatedUser
  })
})


export const deleteProfilePic = (async (req, res, next) =>{
  const user = await userModel.findById(req.user.id)

  if(!user.profilePic){
    return next(new Error(`No profile picture found`, 403));
  }
  await cloudinary.uploader.destroy(user.profilePic.public_id)

  user.profilePic = null;
  await user.save();

  res.status(401).json({
    status: "sucess",
  })
})

export const deleteCoverPic = (async (req, res, next) =>{
  const user = await userModel.findById(req.user.id)

  if(!user.coverPic){
    return next(new Error(`No Cover picture found`, 403));
  }
  await cloudinary.uploader.destroy(user.coverPic.public_id)

  user.coverPic = null;
  await user.save();

  res.status(401).json({
    status: "sucess",
  })
})

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error(`You don't have permisson`, 403));
    }
    next();
  }
};

export const getUsers = factory.getAll(userModel);
export const updateUser = factory.updateOne(userModel)
export const deleteUser = factory.deleteOne(userModel);









export const getMyFollowings = async (req, res, next) => {

  const loginUser = req.user._id;

  const user = await userModel.findOne({ _id: loginUser }).populate({
    path: 'following.userId',
    select: "userName profilePic"
  });
  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }
  const followings = user.following;

  console.log(user.following);
  return res.json({ message: "success", followings });

}

export const getUserFollowings = async (req, res, next) => {

  const { userId } = req.params;

  const user = await userModel.findOne({ _id: userId }).populate({
    path: 'following.userId',
    select: "userName profilePic"
  });

  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }
  const followings = user.following;

  console.log(user.following);
  return res.json({ message: "success", followings });

}




export const getMyFollowers = async (req, res, next) => {

  const loginUser = req.user._id;

  const user = await userModel.findOne({ _id: loginUser }).populate({
    path: 'followers.userId',
    select: "userName profilePic"
  });
  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }
  const followers = user.followers;

  console.log(user.followers);
  return res.json({ message: "success", followers });

}

export const getUserFollowers = async (req, res, next) => {

  const { userId } = req.params;

  const user = await userModel.findOne({ _id: userId }).populate({
    path: 'followers.userId',
    select: "userName profilePic"
  });

  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }
  const followers = user.followers;

  console.log(user.followers);
  return res.json({ message: "success", followers });

}




export const makeFollow = async (req, res, next) => {

  const { userId } = req.params;

  // check userId found or not

  const user = await userModel.findById(userId);
  // console.log({user});
  if (!user || user._id.equals(req.user._id)) {
    return next(new Error("In-valid userId", { cause: 404 }));
  }

  // console.log(user.following);

  // check if i already follow him or not
  const userFollowers = user.followers.map(i => i?.userId?.toString());
  if (userFollowers.includes(req.user._id.toString())) {
    return next(new Error("You already follow this user", { cause: 409 }));
  }


  // console.log({ userFollowers });

  // else
  // add my id to his followers array
  user.followers.push({ userId: req.user._id });
  await user.save();
  // add his id to my following list

  await userModel.findByIdAndUpdate(req.user._id,
    { $push: { following: { userId: new mongoose.Types.ObjectId(userId) } } },
    { new: true }
  )

  if(!createNotification({user:userId,type:"friend_request",sender:req.user._id,content:`${req.user.userName} started following you`, relatedEntity:req.user._id, entityModel:"User"})){
    return next(new Error("failed to send Notification", { cause: 400 }));
  }
  return res.status(200).json({ message: "success" })


}

export const makeUnFollow = async (req, res, next) => {

  const { userId } = req.params;

  // check userId found or not

  const user = await userModel.findById(userId);
  // console.log({user});
  if (!user || user._id.equals(req.user._id)) {
    return next(new Error("In-valid userId", { cause: 404 }));
  }

  // console.log(user.following);

  // check if i already follow him or not
  const userFollowers = user.followers.map(i => i?.userId?.toString());
  if (!userFollowers.includes(req.user._id.toString())) {
    return next(new Error("You don't follow this user", { cause: 409 }));
  }


  console.log({ userFollowers });

  // else
  // add my id to his followers array
  user.followers.pull({ userId: req.user._id });
  await user.save();
  // add his id to my following list

  await userModel.findByIdAndUpdate(req.user._id,
    { $pull: { following: { userId: new mongoose.Types.ObjectId(userId) } } },
    { new: true }
  )

  
  if(!deleteNotification({sender:req.user._id,user:userId,type:"friend_request"})){
    return next(new Error("failed to delete Notification", { cause: 400 }));
  }
  return res.status(200).json({ message: "success" })


}

