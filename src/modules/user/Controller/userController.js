
import * as factory from "./../../../utils/handlerFactory.js"
import userModel from "../../../../DB/models/User.model.js";
import mongoose from "mongoose";
import cloudinary from "../../../utils/coudinary.js"
import { createNotification, deleteNotification } from "../../../utils/notification.js";
import { compare, hashText } from "../../../utils/hashAndComare.js";
import {generateOTP} from "../../../utils/OTP.js"
import otpModel from "../../../../DB/models/OTP.model.js";
import { sendEmail } from "../../../utils/email.js";


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
  const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'phone', 'address');
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

export const verifyPassword = async (req, res, next) => {
  const currentPassword = req.body.password;
  const user = await userModel.findById(req.user._id);
  if (!compare({ plaintext: currentPassword, hashValue: user.password })) {
    return next(new Error("In-valid password", { cause: 400 }));
  }
  return res.status(200).json({
    status: 'success',
  })
}

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
  console.log({user});
  if (user == null || user._id.equals(req.user._id)) {
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

export const updateEmail = async (req, res, next) => {
  const otp = generateOTP();
  const email = req.body.email;
  if(await otpModel.findOne({userId: req.user._id}) != null){
    return next(new Error("OTP is already sent", { cause: 400 }));
  }
  const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">OTP Verfication: </h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <p style="font-size: 30px; margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${otp}</p>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">
    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
    
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
    
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`
  if (!sendEmail({ to: email, subject: "OTP Verification", html })) {
        return next(new Error("Rejected Email", { cause: 400 }));
  }
  await otpModel.create({userId: req.user._id, otp:otp});
  return res.status(200).json({message: "success"});
}

