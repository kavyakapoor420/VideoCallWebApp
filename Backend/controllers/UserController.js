export const getUserHistory=async(req,res)=>{
    const {token}=req.body ;
    try{
         const user=await UserModel.findOne({token:token})
         const meetings=await MeetingModel.find({user_id:user.username})

         res.json(meetings)
    }catch(err){
          res.json({message:"something went wrong"})
    }
}

export const addToHistory=async(req,res)=>{
    const {token,meetingCode}=req.body ;

    try{
          const user=await UserModel.findOne({token:token})
          
          const newMeeting=new MeetingModel({
             user_id:user.username,
             meetingCode:meetingCode 
          })

          await newMeeting.save() 

          res.status(httpStatus.CREATED).json({message:'added meeting code to history'})
    }catch(err){
          res.json({message:`something went wrong ${err}`})
    }
}
