const mongoose=require("mongoose")


const groupChatSchema=new mongoose.model({
    name:{
        type:String,
        unique:false,
        required:[true,"can't be blank"],
    },
    participants:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        }
    ],
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    messages:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message",
            required:true,
        },
    ],
},{timestamps:true})


const GroupChat=mongoose.model("GroupChat",groupChatSchema)

module.exports=GroupChat;