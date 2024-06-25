import * as meetingServices from "../../../services/meeting.service.js"


export const startMeeting = (req,res,next)=>{
    const {hostId,hostName} = req.body;

    var model = {
        hostId:hostId,
        hostName:hostName,
        startTime:Date.now()
    }

    meetingServices.startMeeting(model,(err,results)=>{
        if(err){
            return next(err)
        }

        return res.status(200).json({message:"success",data:results.id}) // results.id is meeting id
    })
}


export const checkMeetingExists = (req,res,next)=>{

    const {meetingId} = req.query;

    meetingServices.checkMeetingExists(meetingId,(err,results)=>{
        if(err){
            return next(err)
        }

        return res.status(200).json({message:"success",data:results}) // results.id is meeting id
})
}


export const getAllMeetingUsers = (req,res,next)=>{

    const {meetingId} = req.query;

    meetingServices.getAllMeetingUsers(meetingId,(err,results)=>{
        if(err){
            return next(err)
        }

        return res.status(200).json({message:"success",data:results}) // results.id is meeting id
})
}