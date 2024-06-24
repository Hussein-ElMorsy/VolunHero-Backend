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
        // console.log(authorization);
        if(!authorization?.startsWith(process.env.BEARER_TOKEN)){
            return next(new Error("In-valid Bearer key",{cause:400}));
        }
        // console.log(req.body)

        const token = authorization.split(process.env.BEARER_TOKEN)[1];
        console.log({token});
        if(!token){
            return next(new Error("In-valid token",{cause:400}));
        }
        const decoded = verifyToken({token,signature:process.env.TOKEN_SIGNATURE});
        // console.log({decoded});
        if(!decoded?._id){
            return next(new Error("In-valid token payload",{cause:400}));
        }

        const user = await userModel.findById(decoded._id).select('email userName image role changePasswordTime');
        // console.log(user);
        if(parseInt(user?.changePasswordTime?.getTime()/1000)>decoded.iat){
            return next(new Error("Expired token",{cause:400}));
        }

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