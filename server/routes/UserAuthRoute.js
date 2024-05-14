const {register,login}=require("../controllers/authController")
const express=require("express")
const route=express.Router()
constJoi=require("joi")
const validator=require("express-joi-validation").createValidator({})
const requireSocketAuth=require("../middleware/requireSocketAuth")

const registerSchema=Joi.Object({
    username:Joi.string().min(3).max(12).required(),
    password:Joi.string().min(6).required(),
    email:Joi.string().email().required()
})

const loginSchema=Joi.Object({
    password:Joi.string().min(6).required(),
    email:Joi.string().email().required()
})
