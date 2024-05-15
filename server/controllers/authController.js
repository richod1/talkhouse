const User=require("../models/UserModel")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")


const register=async(req,res)=>{
try{
const {email,password,username}=req.body;

const userExist=await User.findOne({email:email.toLowerCase()})
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

// default user
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


// login controller
const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email:email.toLowerlCase()})
        if(!user){
            return res.status(404).json({message:"User not found!"})
        }

        const validPassword=await bcrypt.compare(password,user.password)
        if(!validPassword){
            return res.status(400).json({
                message:"Invalid password"
            })
        }

        const token=jwt.sign({user:user._id,username:user.username,email},process.env.JWT_SECRET,{expiresIn:"15d"})
        return res.status(201).json({
            userDtails:{
                _id:user._id,
                username:user.username,
                email:user.email,
                token:token
            }
        })
    }catch(err){
        return res.status(500).jsone({message:"Somthing went wrong"})
    }
}
module.exports={
    register,
    login,
}