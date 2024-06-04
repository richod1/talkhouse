const FriendInvitation=require("../models/FriendInvitation")
const User=require("../models/UserModel")
const {updateUsersInvitations,updateUsersFriendsList}=require("../socketController/notifyConnnectedSocket")
// function for friend invitation
const inviteFriend=async(req,res)=>{
    const{email:senderEmailAddress,userId}=req.user;
    const {email:receiverEmailAddress}=req.body;

    if(senderEmailAddress===receiverEmailAddress){
        return res.status(400).send("Sorry you can'r invite yourself");
    }

    const targetUser=await User.findOne({email:receiverEmailAddress});

    if(!targetUser){
        return res.status(404).send("Sorry the user you trying to invite dosn't exit.Please check email adress and try again")
    }

    const inviteAlreadyExits=await FriendInvitation.findOne({
        senderId:userId,
        receiverId:targetUser._id,
    })

    // check if user friend exist
    if(inviteAlreadyExits){
        return res.status(409).send("You have already sent this user invite");
    }

    const isAlreadyExist=targetUser.friends.some((friend)=>friend.toString()===userId.toString());
    if(isAlreadyExist){
        return res.status(409).send(
            "You are friends with user, Please check your friend first"
        )
    }


    await FriendInvitation.create({
        senderId:userId,
        receiverId:targetUser._id,
    })

    updateUsersInvitations(targetUser._id.toString(),"new");


    return res.status(201).send("INvitation has been sent successfully");
}



// function for accepting Invitation
const acceptInvitation=async(req,res)=>{
    try{
        const {invitationId}=req.body;
        const invitation=await FriendInvitation.exists({_id:invitationId});
        if(!invitation){
            return res.status(404).send("sorry the invitation you are trying ro accept dosen't exist!")
        }
        const deletedInvitation=await FriendInvitation.findByIdAndDelete(invitationId);
    
        const sender=await User.findById(deletedInvitation.senderId);
        const receiver=await User.findById(req.user.userId)

        sender.friends.push(receiver._id);
        receiver.friends.push(sender._id);


        await sender.save();
        await receiver.save();

        updateUsersInvitations(req.user.userId.toString());
        updateUsersFriendsList(req.user.userId.toString());


        updateUsersFriendsList(deletedInvitation.senderId.toString());


        return res.status(200).send("Invitation accepetd successfully!");

    }catch(err){
        return res.status(500).send("Sorry, something went wrong on the acceptInvitation. Please try again")
        
    }
}

module.exports={
    inviteFriend,
    acceptInvitation,
}

