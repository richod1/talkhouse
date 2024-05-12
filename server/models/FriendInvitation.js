const mongoose=require("mongoose")


const friendInvitationSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
},{timestamps:true})

const friendInvitation=mongoose.model("FriendInvitation",friendInvitationSchema)

module.exports=friendInvitation;