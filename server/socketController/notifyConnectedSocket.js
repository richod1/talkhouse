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

// sending direct message to active users
const sendNewDirectMessage=async(conversationId,newMessage)=>{

    const conversation=await Conversation.findById(conversationId);

    const messageAuthor=await User.findById(newMessage.author);

    if(!messageAuthor||!conversation){
        return;
    }

    const message={
        __v:newMessage.__v,
        _id:newMessage._id,
        content:newMessage._content,
        createdAt:newMessage._createdAt,
        updatedAt:newMessage.updatedAt,
        type:newMessage.type,
        author:{
            _id:messageAuthor._id,
            username:messageAuthor.username
        }
    };

    const io=getServerSocketInstance();

    // get a participant active socket connection
    conversation.participants.forEach((participantId)=>{
        const activeConnections=getActiveConnections(participantId.toString());

        activeConnections.forEach((socketId)=>{
            io.to(socketId).emit("direct-message",{
                newMessage:message,
                participants:conversation.participants
            })
        })
    })

    
}

const sendNewGroupMessage=async(groupChatId,newMessage)=>{
    const groupChat=await GroupChat.findById(groupChatId);
    const messageAuthor=await User.findById(newMessage.author);

    if(!messageAuthor || !groupChat){
        return;
    }

    const message={
        __v:newMessage.__v,
        _id:newMessage._id,
        content:newMessage.content,
        createdAt:newMessage.createdAt,
        updatedAt:newMessage.updatedAt,
        type:newMessage.type,
        author:{
            _id:messageAuthor._id,
            username:messageAuthor.username,
        }
    }

    const io=getServerSocketInstance();

    groupChat.participants.forEach((participantId)=>{
        const activeConnections=getActiveConnections(participantId.toString())

        activeConnections.forEach((socketId)=>{
            io.to(socketId).emit("group-message",{
                newMessage:message,
                groupChatId:groupChat._id.toString(),
            })
        })
    })

}

const updateRooms=async(toSpecifiedSocketId=null)=>{
    const io=getServerSocketInstance();
    const activeRooms=getActiveRooms();

    if(toSpecifiedSocketId){
        io.to(toSpecifiedSocketId).emit("active-rooms",{
            activeRooms,
        })
    }else{
        io.emit("active-rooms",{
            activeRooms,
        })
    }

}

const initialRoomUpdate=async(userId,socketId)=>{
const user=await User.findById(userId);

if(!user){
    return;
}

const io=getServerSocketInstance();
const activeRooms=getActiveRooms();

const rooms=[];

activeRooms.froEach((room)=>{
    const isRoomCreatedByMe=room.roomCreator.userId===userId;
    if(isRoomCreatedByMe){
        rooms.push(room);
    }else{
        user.friends.forEach((f)=>{
            if(f.toString()===room.roomCretor.userId.toString()){
                rooms.push(room);
            }
        });
    }
});

io.to(socketId).emit("active-rooms-initial",{
    activeRooms:rooms
})
}
module.exports={
    updateUsersInvitations,
    updateUsersGroupChatList,
    updateUsersFriendsList,
    updateChatHistory,
    sendNewDirectMessage,
    sendNewGroupMessage,
    updateRooms,
    initialRoomUpdate,
}