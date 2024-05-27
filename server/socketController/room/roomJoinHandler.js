const {getActiveRoom,joinActiveRoom}=require("../../socket/activeRooms")
const {updateRooms} =require("../notifyConnectedSockets")


const roomJoinHandler=(socket,data)=>{
    const {roomId}=data;

    const participantDetails={
        userId:socket.user.userId,
        socketId:socket.id,
        username:socket.user.username
    };

    const roomDetails=getActiveRoom(roomId);
    joinActiveRoom(roomId,participantDetails);

    roomDetails.participants.forEach((participant)=>{
        if(participant.socketId !== participantDetails.socketId){
            socket.to(participant.socketId).emit("come-prepare",{
                connUserSocketId:participantDetails.socketId,
            })
        }
    });
    updateRooms();
    
}

module.exports=roomJoinHandler;