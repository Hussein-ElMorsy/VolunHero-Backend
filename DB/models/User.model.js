import mongoose, { Schema, Types, model } from "mongoose";

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        lowercase: true
    },
    slugUserName:{
        type:String,
        required:true,
        lowercase:true
    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'email is required'],
        lowercase: true
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    phone: {
      type: String,
      default: null,
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin', "Organization"]
    },
    status: {
        type: String,
        default: 'offline',
        enum: ['offline', 'online', 'blocked']
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    profilePic: {type:Object,default:null},
    coverPic: {type:Object,default:null},
    images: [Object],
    DOB:  {
        type:String,
        required: function () {
            return this.role === 'User';
        },
        default: null,
    },
    address: {
        type:String,
        required: function () {
            return this.role === 'User';
        },
        default: null,
    },
    gender: {
        type: String,
        default: "Male",
        enum: ["Male", 'Female'],
        required: function () {
            return this.role === 'User';
        },
        
    },
    forgetCode: {
        type: Number,
        default: null,
    },
    changePasswordTime: {
        type: Date,
        default: null
    },
    // Fields specific to organization users

    overview: {
        type: String,
        default: null,
        required: function () {
            return this.role === 'Organization';
        }
        
    },
    website: {
        type: String,
        default: null,
        required: function () {
            return this.role === 'Organization';
        }
    },
    headquarters: {
        type: String,
        default: null,
        required: function () {
            return this.role === 'Organization';
        }
    },
    specialties: {
        type: String,
        default: null,
        required: function () {
            return this.role === 'Organization';
        }
    },
    locations: {
        type: [String],
        default: null,
        required: function () {
            return this.role === 'Organization';
        },
    
    }
    ,
    specification: {
        type: String,
        required: function () {
            return this.role === 'User';
        },
        default: "General",
        enum: ["General", "Medical", "Educational"]
    },
    attachments: [Object],
    following: [{
        userId: {
            type: Types.ObjectId,
            ref: "User",
        }
    }],
    followers: [{
        userId: {
            type: Types.ObjectId,
            ref: "User",
        }
    }],


    socketId:{
        type: String,
    },
    meetingId:{
        type:Types.ObjectId,
        ref:"Meeting"
    },
    joined:{
        type:Boolean,
        

    },
    isAlive:{
        type:Boolean,
        
    }
}, {
    timestamps: true
});

const userModel = mongoose.models.User || model('User', userSchema);
export default userModel;
