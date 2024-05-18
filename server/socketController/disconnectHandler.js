const {leaveAllRooms}=require("../socket/activeRoom")
const {removeConnetedUser,getOnlineUsers}=require("../socket/connectedUsers")
const {updateRooms}=require("./notifyConnectedSocket")

const disconnectedHandler=(socket,io)=>{
    removeConnetedUser({socketId:socket.id});

    io.emit("online-users",getOnlineUsers())
    leaveAllRooms(socket.id);
    updateRooms();
}

module.exports=disconnectedHandler;