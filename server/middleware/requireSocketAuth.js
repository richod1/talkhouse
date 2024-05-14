const jwt=require("jsonwebtoken")




const requiredSocketAuth=(socket,next)=>{
    let token=socket.handshake.auth?.token

    if(!token){
        return res.status(401).json({message:"Token is required to authorization"})
    }
    try{

        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        socket.user=decoded;

    }catch(err){
        const error=new Error("403, Not Authorized")
        return socket(error)
    }

    return next();


}

module.exports=requiredSocketAuth;