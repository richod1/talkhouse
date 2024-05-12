// main app endpoinnt
const express=require("express")
const app=express()
const cors=require("cors")
require("dotenv").config()
const port=3000||process.env.PORT
const mongoose=require("mongoose")

app.use(express.json())
app.use(cors())


app.get("/",(req,res)=>{
    res.status(200).json({message:"Api is ready"})
})


// database connection
mongoose.connect(`${process.env.MONGO_URL}`).then(()=>{
    console.log(`Database is running...`)
    app.listen(port,(err)=>{

        if(err) throw new Error(`Sever is asleep...`)
        console.log(`server is up on port :${port}`)
    })
}).catch((err)=>{
    console.log(`Database failed to run... : ${err}`)
})