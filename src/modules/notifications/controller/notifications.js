import notificationModel from "../../../../DB/models/Notification.model.js"



export const getNotifications = async(req,res,next)=>{

    const notifications = await notificationModel.find({user:req.user._id}).sort({ createdAt: -1 });

    return res.status(200).json({message:"success",notifications});

}

export const readNotification = async(req,res,next)=>{

    const {notificationId} = req.params;
   
    const notification = await notificationModel.findById(notificationId);
    console.log(notification.user);
    console.log(req.user._id);
    if(!req.user._id.equals(notification.user)){
        return next(new Error("Not authorized user", { cause: 400 }));
    }
    notification.read=true;

    await notification.save();
    return res.status(200).json({message:"success"});

}
