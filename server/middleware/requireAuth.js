const jwt=require("jsonwebtoken")


const requireAuth=async(req,res,next)=>{
    let token=req.body.token||req.query||req.headers["authorization"];

    if(!token){
        res.status(400).json({message:"Unauthorized :token is required for authorization "})
    }
    try{
        token=token.split(" ")[1]

        const decoded=jwt.verify(yoken,process.env.JWT_SECRET);
        req.user=decoded;
    }catch(err){
        return res.status(401).json("Invalid Token")
    }

    return next()

}

module.exports=requireAuth