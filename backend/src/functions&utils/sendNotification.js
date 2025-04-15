//Modules 
const { getIO } = require("../functions&utils/socketHandler.js"); // adjust path accordingly

//Models 
const notificationModel = require("../models/Notification.js");

//

const sendNotification = async (room,emt,message,userId,metadata)=>{
    const io = getIO();

    if(!io)
    {
        console.error("Io Undefined")
        return;
    }

    io.to(room.toString()).emit(emt,{
        message:message,
        metadata
    });

    if(userId)
    {
        const notification = new notificationModel({
            user_id:userId,
            type: emt,
            message: message,
            read_status:false
        })
        const nId = notification.save();
        console.log("Sent Notifications")
        return nId.id;
    }
}


module.exports = sendNotification;
