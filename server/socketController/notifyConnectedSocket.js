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