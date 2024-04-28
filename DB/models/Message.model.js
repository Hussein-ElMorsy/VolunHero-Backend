import mongoose, { Schema, model } from "mongoose";




const messageSchema = new Schema({

    chatId: String,
    senderId: String,
    text: String,
    isDeleted: {
        type: Boolean,
        default: false,
    }

}, {
    timestamps: true
})


const messageModel = mongoose.models.Message || model('Message', messageSchema);

export default messageModel