const User=require("../models/UserModel")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")


const register=async(req,res)=>{
try{
const {email,password,username}=req.body;

const userExist=await User.findOne({email:email.toLowercase()})
if(userExist){
    return res.status(401).json({message:"User already exist"})
}

// hash password
const encryptPassword=await bcrypt.hash(password,10)
const userDoc={
    username,
    email:email.toLowercase(),
    password:encryptPassword,
}


const degraftMail=await User.findOne({email:"frimpsup@gmail.com"})
// saving admin

if(degraftMail){
    userDoc.friends=[degraftMail._id]
}

// create user into database schema
    const user=await User.create(userDoc)
    if(degraftMail){
        degraftMail.friends=[...degraftMail.friends,user._id];
        await degraftMail.save()
    }

    // sucuring with jwt tokens
    const token=jwt.sign({
        user:user_id,
        email,
        username:user.username,
    },process.env.JWT_SECRET,{expiresIn:"16d"})

    res.status(200).json({userDetailes:{
        _id: user._id,
        email: user.email,
        token: token,
        username: user.username, 
    }})

}catch(err){
    console.log("Something went wrong at register ",err.message)
    return res.status(500).json("Error occured at register,Please try again ")
}
}