import mongoose from 'mongoose'

const meetingSchema=new mongoose.Schema({
    user_id:{
        type:String,
    },
    meetingCode:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

const MeetingModel=mongoose.model("MeetingModel",meetingSchema)


export default MeetingModel