const {getActiveRoom,leaveActiveRoom}=require("../../socket/activeRooms")
const {updateRooms}=require("../notifyConnectedSocket");



const roomLeaveHandler=(socket,data)=>{
    const {roomId}=data;

    const activeRoom=getActiveRoom(roomId);

    if(activeRoom){
        leaveActiveRoom(roomId,socket.id);

        const updatedActiveRoom=getActiveRoom(roomId);
        if(updatedActiveRoom){
            updatedActiveRoom.participants.forEach((participant)=>{
                socket.to(participant.sockeyId).emit("room-participant-left",{
                    connUserSocketId:socket.id,
                })
            })
        }
        updateRooms();
    }
}


module.exports=roomLeaveHandler;