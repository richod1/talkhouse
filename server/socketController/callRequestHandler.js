const {getServerSocketInstance,getActiveConnections}=require("../socket/connectedUsers")


const callRequestHandler=(socket,data)=>{
    const {receiverUserId,callerName,audioOnly,signal}=data;

    const callerUserId=socket.user.userId;

    // active connections from receiver
    const activeConnections=getActiveConnections(receiverUserId);
    const io=getServerSocketInstance();

    activeConnections.forEach((socketId)=>{
        io.to(socketId).emit("call-request",{
            callerName,callerUserId,audioOnly,signal
        })
    })
}

module.exports=callRequestHandler;

