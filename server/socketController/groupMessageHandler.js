const GroupChat=require("../models/GroupChat")
const Message=require("../models/MessageModel")
const {updateChatHistory,sendNewGroupMessage}=require("./notifyConnectedSocket")



const groupMessageHandler=async(socket,data)=>{
    try{
        const {groupChatId,message}=data;
        const senderUserId=socket.user.userId;


        const newMessage=await Message.create({
            author:senderUserId,
            content:message,
            type:"Group",
        });

        const groupChat=await GroupChat.findOne({_id:groupChatId});

        if(!groupChat){
            return;
        }

        groupChat.message=[...groupChat.message,newMessage._id];
        await groupChat.save();

        sendNewGroupMessage(groupChat._id.toString(),newMessage)
    }catch(err){
        console.log(err)

    }
}

module.exports=groupMessageHandler;