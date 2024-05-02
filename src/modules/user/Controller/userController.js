
import * as factory from "./../../../utils/handlerFactory.js"
import userModel from "../../../../DB/models/User.model.js";

export const getUserModule =  async (req, res, next) => {
  return res.json({ message: "user controller" });
}
export const getMe = (req, res, next) =>{  
  req.params.id = req.user.id;
  next();
}
export const getUser = factory.getOne(userModel);


const filterObj = (obj, ...allowedFields) =>{
  const newObj = {};
  Object.keys(obj).forEach(el =>{
      if(allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}
export const updateMe = (async (req, res, next) =>{
  // console.log(req.file) // for uploading

  // 1) Create error if user POSTs password data 
  if(req.body.password || req.body.passwordConfirm){ // Not confirmed yet
      return next(new Error(
          `This route is not for password updates. please use /updateMyPassword`, 400));
  };
  // 2) Flitered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'email'); 
  if(req.file) filteredBody.photo = req.file.filename

  // 3) Update user document                                               
  const updatedUser = await userModel.findByIdAndUpdate(req.user.id,filteredBody,{  // findByIdAndUpdate won't use middlewares in Model "NO NEED TO ENCRYPT PASSWORDS"
      new: true,
      runValidators: true
  } ) 
  res.status(200).json({
      status: 'success',
      user: updatedUser
  });
});

export const deleteMe = (async (req, res, next) => { // Not sure
  let id;
  if(req.user.id){
    id = req.user.id
  }
  if(!id) return next(new Error("No id found")) // Modification is done

  const doc = await userModel.findByIdAndDelete(id);
  if (!doc) {
    return next(new Error("No Document found with this id"));
  }
  res.status(204).json({
    status: "sucess",
    data: null,
  });
});


export const restrictTo = (...roles) => {
  return (req, res, next) => {
      if(!roles.includes(req.user.role)){
          return next(new Error(`You don't have permisson`, 403));
      }
      next(); 
  }
};

export const getUsers = factory.getAll(userModel);
export const updateUser = factory.updateOne(userModel)
export const deleteUser = factory.deleteOne(userModel);

