const GroupChat=reqire("../models/GroupChat.js")
const {getServerSocketInstance}=require("../socket/connectedUsers")


const groupChatHistoryHandler=async(socket,groupChatId)=>{
    try{
        const groupChat=await GroupChat.findById(groupChatId).populate({
            path:"messages",
            model:"Message",
            populate:{
                path:"author",
                select:"username _id",
                model:"User"
            }
        });
        if(!groupChat){
            return;
        }

        const io=getServerSocketInstance();

        return io.to(socket.id).emit("group-chat-history",{
            messages:groupChat.message,
            groupChatId:groupChat._id.toString()
        })
    }catch(err){
        consoole.log(err)

    }
}


module.exports=groupChatHistoryHandler;