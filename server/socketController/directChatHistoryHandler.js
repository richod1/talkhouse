const Conversation=require("../models/Conversation")
const {getServerSocket}=require("../socket/connectedUsers")
const {updateChatHistory}=require("./notifyConnectedSocket")

const directChatHistoryHandler=async(socket,receiverUserId)=>{
    try{
        const senderUserId=socket.user.userId;

        const conversation=await Conversation.findOne({
            participants:{$all:[receiverUserId,senderUserId]},
            type:"DIRECT",
        });

        if(!conversation){
            return;
        }

        updateChatHistory(conversation._id.toString(),socket.id);
    }catch(err){
        console.log(err)
    }
}

module.exports=directChatHistoryHandler;