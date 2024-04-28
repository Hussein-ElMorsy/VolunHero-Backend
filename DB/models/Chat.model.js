import mongoose, { Schema ,model} from "mongoose";



const chatSchema = new Schema({

    members:Array,

},{
    timestamps:true
})


const chatModel = mongoose.models.Chat || model('Chat', chatSchema);

export default chatModel;