import mongoose, { Schema ,Types,model} from "mongoose";


const chatSchema = new Schema({

    members:[
        {
          userId: {
            type: Types.ObjectId,
            ref: "User",
            required:true,
          },
        },
      ],

},{
    timestamps:true
})


const chatModel = mongoose.models.Chat || model('Chat', chatSchema);

export default chatModel;