

// create message

import messageModel from "../../../../DB/models/Message.model.js";

export const createMessage = async (req, res, next) => {

    const { chatId, senderId, text } = req.body;

    const message = new messageModel({ chatId, senderId, text });

    await message.save();

    return res.status(200).json({ message: "success", message });


}

export const getMessages = async (req, res, next) => {
    const { chatId } = req.params;

    const messages = await messageModel.find({ chatId });
    return res.status(200).json({ message: "success", messages });


}

export const deleteMessage = async (req,res,next)=>{
    const {messageId} = req.params;
    const message = await messageModel.findById(messageId);
    if(!message){
        throw next(new Error("message not found",{cause:404}))
    }

    message.isDeleted = true;
    await message.save();
    return res.status(200).json({ message: "success"});

}