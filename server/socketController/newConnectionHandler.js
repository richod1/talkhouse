const {addNewConnectedUser,getOnlineUsers}=require("../socket/connectedUsers")
const {updateRooms,initialRoomUpdate,updateUsersFriendsList,
    updateUsersInvitations,updateUsersGroupChatList
}=require("./notifyConnectedSocket")


const newConnectionHandler=(socket,io)=>{
    addNewConnectedUser({socketId:socket.id,userId:socket.user.userId});

    io.emit("online-users",getOnlineUsers());

    updateUsersInvitations(socket.user.userId);

    updateUsersFriendsList(socket.user.userId);

    updateUsersGroupChatList(socket.user.userId);

    initialRoomUpdate(socket.user.userId,socket.id);
}

module.exports=newConnectionHandler;
