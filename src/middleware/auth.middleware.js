import userModel from "../../DB/models/User.model.js";
import { verifyToken } from "../utils/generateAndVerifyToken.js"
import { asyncHandler } from "../utils/errorHandling.js";

export const roles = {
    Admin :"Admin",
    User:"User",
    Organization :"Organization"
}

export const auth = (accessRoles=[])=>{
    return asyncHandler( async (req,res,next)=>{
        const {authorization} = req.headers;
        if(!authorization?.startsWith(process.env.BEARER_TOKEN)){
            return next(new Error("In-valid Bearer key",{cause:400}));
        }

        const token = authorization.split(process.env.BEARER_TOKEN)[1];
        console.log({token});
        if(!token){
            return next(new Error("In-valid token",{cause:400}));
        }
        const decoded = verifyToken({token,signature:process.env.TOKEN_SIGNATURE});
        if(!decoded?._id){
            return next(new Error("In-valid token payload",{cause:400}));
        }

        const user = await userModel.findById(decoded._id).select('email userName image role changePasswordTime phone');

        if(!user){
            return next(new Error("Not registered user",{cause:400}));
        }

        if(!accessRoles.includes(user.role)){
            return next(new Error("Not authorized user",{cause:400}));
        }
        console.log(user)
        req.user= user;
        return next()

    })
}