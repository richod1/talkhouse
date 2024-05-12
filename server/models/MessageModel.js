const mongoose=require("mongoose")
const messageSchema=new mongoose.Schema({
    author:{
        type:mongoose.Schema.TYpes.ObjectId,
        ref:"User",
        required:true,
    },
    content:{
        type:String,
        required:[true,"can't be blank"],
    },
    type:{
        type:String,
    }
},{
    timestamp:true
})

const message=mongoose.model("Message",messageSchema)

module.exports=message;