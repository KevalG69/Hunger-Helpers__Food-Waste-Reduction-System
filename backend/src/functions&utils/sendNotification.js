//Modules 


//Models 
const notificationModel = require("../models/Notification.js");

//

const sendNotification = async (room,emt,message,metadata)=>{

    req.io.to(room.toString()).emit(emt,{
        message:message,
        metadata
    });

    if(req.user.id == room)
    {
        const notification = new notificationModel({
            user_id:req.user.id,
            type: emt,
            message: message,
            read_status:false
        })
        const nId = notification.save();
        return nId.id;
    }
}


module.exports = sendNotification;
