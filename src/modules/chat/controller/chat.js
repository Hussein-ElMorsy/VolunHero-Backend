import chatModel from "../../../../DB/models/Chat.model.js"
import messageModel from "../../../../DB/models/Message.model.js";



export const getAllChats = async (req,res,next)=>{

    const chats = await chatModel.find();
    if(chats.length==0){
        throw next(new Error("No chats found",{cause:404}))
    }

    return res.status(200).json({ message: "success", chats });

}

export const createChat = async (req, res, next) => {

    const { firstId, secondId } = req.body;
    const chat = await chatModel.findOne({ members: { $all: [firstId, secondId] } });

    if (chat) {
        return res.json({ message: "success", chat });
    }

    const newChat = await chatModel.create({ members: [firstId, secondId] });

    return res.status(201).json({ message: "success", newChat });

}


export const findUserChats = async (req, res, next) => {
    const { userId } = req.params;

    const chats = await chatModel.find({ members: { $in: [userId] } });

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

    const chat = await chatModel.findById(chatId);
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