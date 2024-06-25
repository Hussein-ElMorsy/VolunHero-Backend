import meetingModel from "../../DB/models/Meeting.model.js";
import userModel from "../../DB/models/User.model.js";



export async function getAllMeetingUsers (meetingId,callBack){


    userModel.find({meetingId})
    .then((response)=>{
        return callBack(null,response);
    })
    .catch((err)=>{return callBack(err)});


}


export async function startMeeting(params,callBack){

    const meetingSchema = new meetingModel(params);
    meetingSchema.save().then((response)=>{
        return callBack(null,response);
    }).catch((err)=>{return callBack(err)});

}


export async function joinMeeting (params,callBack){


    const meetingUserModel = new meetingModel(params);


    meetingUserModel.save().then(async (response)=>{
        await meetingModel.findOneAndUpdate({id:params.meetingId},{$addToSet:{"meetingUsers":meetingUserModel}});
        return callBack(null,response);
    }).catch((err)=>{return callBack(err)});

    userModel.find({meetingId}).then((response)=>{
        return callBack(null,response);
    }).catch((err)=>{return callBack(err)});


}


export async function isMeetingPresent(meetingId,callBack){
    meetingModel.findById(meetingId).populate("meetingUsers","User").then((response)=>{
        if(!response) callBack ("In-valid meeting id");
        else callBack (null,true);

    }).catch((err)=>{return callBack(err,false)});

}


export async function checkMeetingExists(meetingId,callBack){
    meetingModel.findById(meetingId).populate("meetingUsers","User").then((response)=>{
        if(!response) callBack ("In-valid meeting id");
        else callBack (null,response);

    }).catch((err)=>{return callBack(err,false)});

}

export async function getMeetingUser(params,callBack){
    const {meetingId,userId} = params;

    userModel.find({meetingId,userId}).then((response)=>{
        return callBack(null,response[0])
    }).catch((err)=>{return callBack(err)});
    
}

export async function updateMeetingUser(params,callBack){
   
    userModel.updateOne({userId:params.userId},{$set:params},{new:true}).then((response)=>{
        return callBack(null,response)
    }).catch((err)=>{return callBack(err)});
    
}


export async function getUserBySocketId (params,callBack){

    const {meetingId,socketId}= params;

    userModel.find({meetingId,socketId}).limit(1).then((response)=>{
        return callBack(null,response)
    }).catch((err)=>{return callBack(err)});
}