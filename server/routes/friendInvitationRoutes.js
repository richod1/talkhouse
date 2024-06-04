const express=require("express")
const router=express.Router();
const {inviteFriend,acceptInvitation,rejectInvitation,removeFriend}=require("../controllers/friendInvitationController")