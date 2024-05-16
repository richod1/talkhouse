const mongoose=require("mongoose")
const User=require("../models/UserModel")
const Conversation=require("../models/Conversation")
const FriendInvitation=require("../models/FriendInvitation")
const GroupChat=require("../models/GroupChat")
const {getActiveConnections, getServerSocketInstance}=require("../socket/connectedUsers")
const {getActiveRooms}=require("../socket/activeRoom")


const updateUsersInvitations=async(userId,isNew)=>{
    if(isNew === "new"){
        console.log("new Invitation")
    }

    const invitations=await FriendInvitation.find({
        receiverDi:userId,
    }).populate("senderId",{username:1,email:1,_id:1});


    const activeConnections=getActiveConnections(userId);

    const io=getServerSocketInstance();

    activeConnections.forEach(socketId=>{
        io.to(socketId).emit("friend-invitations",invitations);
    })
}

const updateUsersGroupChatList=async(userId)=>{
    const user=await User.findById(userId).populate([
        {
            path:"groupChats",
            populate:{
                path:"paticipants",
                model:"User",
                select:"_id email username",
            },
        },{
            path:"groupChats",
            populate:{
                path:"admin",
                model:"User",
                select:"_id email username",
            }
        }
    ])

    if(!user){
        return;
    }


    const groupChats=user.groupChats?user.groupChats.map((groupChat)=>{
        return{
            groupId:groupChat._id,
            groupName:groupChat.name,
            participants:groupChat.participants,
            admin:groupChat.admin
        }
    }) : [];

    const activeConnections=getActiveConnections(userId)

    const io=getServerSocketInstance()

    activeConnections.forEach((socketId)=>{
        io.to(socketId).emit("groupChats-list",groupChats|| []);
    })
}

// updating friends chat list

const updateUsersFriendsList=async(userId)=>{
    const user=await User.findBy(userId).populate("friends",{
        username:1,
        email:1,
        _id:1,
    });

    if(!user){
        return;
    }

const friends=user.friends?user.friends.map((friend)=>{
    return {
        id:friend._id,
        username:friend.username,
        email:friend.email,
    }
}):[];

const activeConnections=getActiveConnections(userId);

// send all friends active socket to all connections
const io=getServerSocketInstance();
activeConnections.forEach((socketId)=>{
    io.to(socketId).emit("friends-list",friends||[]);
})

}


// update chay history
const updateChatHistory=async(conversationId,toSpecifiedSocketId=null)=>{
    const conversation=await Conversation.findById(conversationId).populate({
        path:"message",
        model:"Message",
        populate:{
            path:"author",
            select:"usrname _id",
            model:"User"
        }
    })

    if(!conversation){
        return;
    }

    const io=getServerSocketInstance();

    if(toSpecifiedSocketId){
        return io.to(roSpecifiedSocketId).emit("direct-chat-history",{
            message:conversation.message,
            participants:conversation.participants
        })
    }

    conversation.participants.forEach((participantId)=>{
        const activeConnections=getActiveConnections(participantId.toString());

        activeConnections.forEach((socketId)=>{
            io.to(socketId).emit("direct-chat-history",{
                message:conversation.message,
                participants:conversations.participants
            })
        })
    })
}

module.exports={
    updateUsersInvitations,
    updateUsersGroupChatList,
    updateUsersFriendsList,
    updateChatHistory,
}