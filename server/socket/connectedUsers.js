const connectedUsers=new Map();
let io=null;

// connect new user
const addNewConnectedUser=({socketId,userId})=>{
    connectedUsers.set(socketId,{userId});
}


const removeConnetedUser=({socketId})=>{
    if(connectedUsers.has(socketId)){
        connectedUsers.delete(socketId);
    }
}

// get all conneted users
const getActiveConnections=(userId)=>{
    const activeConnections=[];
    connectedUsers.forEach((value,key)=>{
        if(value.userId===userId){
            activeConnections.push(key);
        }
    });

    return activeConnections;
}

const getOnlineUsers=()=>{
    const onlineUsers=[];
    connectedUsers.forEach((value,key)=>{
        onlineUsers.push({
            userId:value.userId,
            socketId:key,
        })
    })
    return onlineUsers;
}

// setting server instance
const setServerSocketInstance=(ioInstance)=>{
    io=ioInstance;
}

// get server instance
const getServerSocketInstance=()=>{
    return io;
}


module.exports={
    addNewConnectedUser,
    removeConnetedUser,
    getOnlineUsers,
    getActiveConnections,
    setServerSocketInstance,
    getServerSocketInstance
}

