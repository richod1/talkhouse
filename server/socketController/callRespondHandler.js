const {getServerSocketInstance,getActiveConnections}=require("../socket/connectedUsers")


const callRespondHandler=(socket,data)=>{
    const {receiverUserId,accepted,signal}=data;
    const {userId}=socket.user;


    // geting all active users
    const activeConnections=getActiveConnections(receiverUserId);

    // sending call response
    const io=getServerSocketInstance();

    activeConnections.forEach((socketId)=>{
        io.to(socketId).emit("call-response",{
            otherUserId:userId,
            accepted,
            signal
        })
    })
}

module.exports=callRespondHandler;