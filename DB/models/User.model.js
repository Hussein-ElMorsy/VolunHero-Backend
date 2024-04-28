import mongoose, { Schema, Types, model } from "mongoose";


const userSchema = new Schema({
    firstName:String,
    lastName:String,
    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        lowercase:true

    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'userName is required'],
        lowercase:true
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    },
    status:{
        type:String,
        default: 'offline',
        enum: ['offline', 'online','blocked']

    }
    ,
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    image: Object,
    DOB: String,
    address:String,
    gender:{
        type:String,
        default:"Male",
        enum:["Male",'Female']
    },
    forgetCode:{
        type:Number,
        default:null,
    },
    changePasswordTime:{
        type:Date,
        default:null
    },
    wishList:{
        type:[{type:Types.ObjectId,ref:'Product'}]
    }
}, {
    timestamps: true
})

// Check again
userSchema.pre('save', async function(next){ // For updating passwordChangetAt in restPassword
    if(!this.isModified('password') || this.isNew) return next();  // new => New Doc not change password

    this.changePasswordTime = Date.now() - 1000; 
    next();                                    
});

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.changePasswordTime){
        const changeTimestamp = parseInt(this.changePasswordTime.getTime() / 1000, 10);
        // console.log(changeTimestamp, JWTTimestamp);
        return JWTTimestamp < changeTimestamp;
    }
    return false;
}
const userModel = mongoose.models.User || model('User', userSchema);
export default userModel