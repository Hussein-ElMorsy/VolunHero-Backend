import chatModel from "../../../../DB/models/Chat.model.js"
import messageModel from "../../../../DB/models/Message.model.js";
import mongoose from 'mongoose';
import userModel from "../../../../DB/models/User.model.js";

export const getAllChats = async (req,res,next)=>{

    const chats = await chatModel.find().populate({
        path:"members.userId",
        select:"userName profilePic"
    })

      console.log(chats[0].members);

    if(chats.length==0){
        throw next(new Error("No chats found",{cause:404}))
    }

    return res.status(200).json({ message: "success", chats });

}

export const createChat = async (req, res, next) => {
    const { firstId, secondId } = req.body;

    // Convert firstId and secondId to ObjectIds if they are not already
    const firstObjectId = new mongoose.Types.ObjectId(firstId);
    const secondObjectId = new mongoose.Types.ObjectId(secondId);

    if(!await userModel.findById(firstId)||!await userModel.findById(secondId)){
        return next(new Error("In-valid users id"),{cause:400});
    }

    const members = [
        { userId: firstObjectId },
        { userId: secondObjectId }
    ];

    console.log({members});
    const chat = await chatModel.findOne({
        "members.userId": { $all: members.map(member => member.userId) }
    });
    
    console.log({chat});

    if (chat) {
        return res.json({ message: "success", chat });
    }

    const newChat = await chatModel.create({ members });
    return res.status(201).json({ message: "success", newChat });
}



export const findUserChats = async (req, res, next) => {
    const userId  = req.user._id;
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    
    // const chats = await chatModel.find({ members: { $in: [userId] } });
    const chats = await chatModel.find({ "members.userId":userId }).populate({
        path: "members.userId",
        select:"userName profilePic"
        
      }).select("userName");
    

    return res.status(200).json({ message: "success", chats });

}

export const findChat = async (req, res, next) => {
    const { firstId, secondId } = req.params;

    const chat = await chatModel.findOne({ members: { $all: [firstId, secondId]} });
    if(! chat ){
        throw next(new Error("Chat not found",{cause:404}))
    }
    return res.status(200).json({ message: "success", chat });

}

export const findChatById = async (req, res, next) => {
    const {chatId} = req.params;

    const chat = await chatModel.findById(chatId).populate({
        path: "members.userId",
        select:"userName profilePic"
        
      }).select("userName");
    ;
    if(! chat ){
        throw next(new Error("Chat not found",{cause:404}))
    }
    return res.status(200).json({ message: "success", chat });

}


export const deleteChat = async (req,res,next)=>{

    const {chatId} = req.params;
    const chat = await chatModel.findById(chatId);
    if(!chat){
        throw next(new Error("Chat not found",{cause:404}))
    }

    const deletedChat = await chatModel.deleteOne({_id:chatId});
    const deleteChatMessages = await messageModel.deleteMany({chatId});

    console.log({deletedChat,deleteChatMessages});
    if(!deletedChat||!deleteChatMessages){
        throw next(new Error("Chat not found",{cause:400}))
    }

    return res.status(200).json({ message: "success"});

}