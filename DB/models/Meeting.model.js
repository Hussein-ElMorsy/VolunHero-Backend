import mongoose, { Schema ,Types,model} from "mongoose";



const meetingSchema = new Schema({

    hostId:{
        type:String,
        required:true,
    },
    hostName:{
        type:String,
        required:false,
    },
    startTime:{
        type:Date,
        required:true,
    },
    meetingUsers:[
        {
            type:Types.ObjectId,
            ref:'User'
        }
    ]

},{
    timestamps:true,
    toJSON:{
        transform:function(doc,ret){
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    }
})


const meetingModel = mongoose.models.Meeting || model('Meeting', meetingSchema);

export default meetingModel;