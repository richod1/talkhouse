// const {register,login }=require("../controllers/authController")
const {login,register}=require("../controllers/authController")
const express=require("express")
const router=express.Router()
constJoi=require("joi")
const validator=require("express-joi-validation").createValidator({})
// const requireSocketAuth=require("../middleware/requireSocketAuth")
const requireAuth=require("../middleware/requireAuth")

const registerSchema=Joi.Object({
    username:Joi.string().min(3).max(12).required(),
    password:Joi.string().min(6).required(),
    email:Joi.string().email().required()
})

const loginSchema=Joi.Object({
    password:Joi.string().min(6).required(),
    email:Joi.string().email().required()
})


// test route

router.get("/test",requireAuth,(req,res)=>{
    res.send(`hello, ${req.user.email}`);
});

// login route
router.post("/login",validator.body(loginSchema),login);
// register route
router.post("/register",validator.body(registerSchema),register);


// me {userid route}
router.get("/me",requireAuth,(req,res)=>{
    res.status(200).json({
        me:{
            _id:req.user.userId,
            email:req.user.email,
            username:req.user.username
        }
    })
})

module.exports=router;
