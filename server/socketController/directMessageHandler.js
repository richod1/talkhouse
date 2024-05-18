const Conversation=require("../models/Conversation")
const Message=require("../models/MessageModel")
const {updateChatHistory,sendNewDirectMessage}=require("./notifyConnectedSocket")


const directMessageHandler=async(socket,data)=>{
    try{

        const {receiverUserId,message}=data;
        const senderUserId=socket.user.userId;

        const newMessage=await Message.create({
            author:senderUserId,
            content:message,
            type:'DIRECT',
        });

        const conversation=await Conversation.findOne({
            participants:{$all:[receiverUserId,senderUserId]},
        });

        if(conversation){
            console.log("conversation already exist!")

            conversation.messages=[...conversation.messages,newMessage._id];
            await conversation.save();

            sendNewDirectMessage(conversation._id.toString(),newMessage);
        }else{
            console.log("creating new conversation");

            const newConversation=await Conversation.save({
                participants:[senderUserId,receiverUserId],
                messages:[newMessage._id]
            })

            sendNewDirectMessage(newConversation._id.toString(),newMessage);
        }

    }catch(err){
        console.log(err)
    }

    module.exports=directMessageHandler;

}