const {getServerSocketInstance,getActiveConnections}=require("../socket/connectedUsers")

const notifyChatLeft=(socket,data)=>{
    const { receiverUserId}=data;


    const activeConnections=getActiveConnections(receiverUserId);


    const io=getServerSocketInstance();

    activeConnections.forEach((socketId)=>{
        io.to(socketId).emit("notify-chat-left");
    })
}

module.exports=notifyChatLeft;