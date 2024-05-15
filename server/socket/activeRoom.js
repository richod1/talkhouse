const {v4:uuidv4}=require("uuid")


let activeRooms=[];

const addNewActiveRoom=(userId,username,socketId)=>{
    const newActiveRoom={
        roomCreator:{
            userId,
            socketId,
            username
        },
        participants:[
            {
                userId,
                username,
                socketId,
            }
        ],
        roomId:uuidv4(),
    
    };
    activeRooms=[...activeRooms,newActiveRoom];

    console.log(activeRooms);

    return newActiveRoom;

};

// getting all active rooms
const getActiveRooms=()=>{
    return [...activeRooms];
}

// getting single active room
const getActiveRoom=(roomId)=>{
    const activeRoom=activeRooms.find((activeRoom)=>activeRoom.roomId===roomId);


    if(activeRoom){
        return{
            ...activeRoom,
        }
    }else{
        return null;
    }
}

// joining Active room
const joinActiveRoom=(roomId,newParticipant)=>{
    const room=activeRooms.find((room)=>room.roomId === roomId);
    console.log("room has been found")

    activeRooms=activeRooms.filter((room)=>room.roomId!==roomId);
    console.log(activeRooms)


    const updateRoom={
        ...room,participants:[...room.participants,newParticipant],
    };
    activeRooms.push(updateRoom);
    console.log("Joining room")
    console.log(activeRooms)
}

const leaveActiveRoom=(roomId,participantSocketId)=>{
    const activeRoom=activeRooms.find((room)=>room.roomId===roomId);


    if(activeRoom){
        const copyOfActiveRoom={...activeRoom};
        copyOfActiveRoom.participants=copyOfActiveRoom.participants.filter(
            (participant)=>participant.socketId !==participantSocketId
        );
        activeRooms=activeRooms.filter((room)=>room.roomId !== roomId);
        if(copyOfActiveRoom.participant.length>0){
            activeRooms.push(copyOfActiveRoom)
        }
    }

    console.log("leaving")
    console.log(activeRooms)
}


// leave all rooms
const leaveAllRooms=(connectedSocket)=>{
    const updatedActiveRooms=activeRooms.map((room)=>{
        return{
            ...room,
            participants:room.participants.filter((participant)=>{
                return participant.socketId !== connectedSocket;
            })
        }
    })
    activeRooms=updatedActiveRooms;
}



module.exports={
    addNewActiveRoom,
    getActiveRooms,
    getActiveRoom,
    joinActiveRoom,
    leaveActiveRoom,
    leaveAllRooms
}