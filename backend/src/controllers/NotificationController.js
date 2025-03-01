//Modules

//Models
const UserModel = require("../models/User.js");
const NotificationModel = require("../models/Notification.js");
//Middlewares

//function

const getAllUserNotification = async (req,res)=>{
    try
    {
        //extracting data
        const {userId} = req.query;

        //finding user
        const user = await UserModel.findById(userId);

        //checking user exist
        if(!user)
        {
            return res.status(404)
                    .json({
                        message:"User NOT FOUND",
                        success:false,
                        data:null,
                        total:0
                    })
        }

        //finding notifications
        const notificationModel = await NotificationModel.find({user_id:userId});

        const total = await NotificationModel.countDocuments({user_id:userId});
        //checking if notifications 
        if(!notificationModel.length)
        {
            return res.status(404)
                    .json({
                        message:"Notification NOT FOUND",
                        success:false,
                        data:[],
                        total
                    })
        }

        //if notifications exist
        res.status(200)
            .json({
                message:"Fetched Notification Successfully",
                success:true,
                data:notificationModel,
                total
            })

    }
    catch(error)
    {
        console.error(error);
        res.status(500)
            .json({
                message:"Failed to Fetch Notifications",
                success:false,
                data:[],
                total:0,
                error
            })
    }
}

const markAsRead = async (req,res)=>{
    try
    {
        const {notificationIds} = req.body;

        //finding Notifications
        const notifications = await NotificationModel.find(notificationIds);

        //checking if notifications exist
        if(!notificationIds.length)
        {
            return res.status(404)
                    .json({
                        message:"Notification NOT FOUND",
                        success:false
                    })
        }

        //if notification exist
        notifications.forEach((notification)=>{
                if(!notification.read_status)
                {
                    notification.read_status=true;
                }
        })

        //
        res.status(200)
            .json({
                message:"Marked Notification As Read",
                success:true
            })
    }
    catch(error)
    {
        console.error(error);
        res.status(500)
            .json({
                message:"Failed to Mark as Read",
                success:false,
                error
            })
    }
}

const deleteNotification = async (req,res)=>{
    try
    {
        //geting notification id to Delete
        const {notificationId} = req.query;

        //finding notification
        const notification = await NotificationModel.findById(notificationId);

        //checking if notification exist
        if(!notification)
        {
            return res.status(404)
                    .json({
                        message:"Notification NOT FOUND",
                        success:false
                    })
        }

        await NotificationModel.findByIdAndDelete(notificationId);

        res.status(200)
            .json({
                message:"Deleted Notification Successfully",
                success:true
            })
    }
    catch(error)
    {
        console.error(error);
        res.status(500)
            .json({
                message:"Failed to Delete Notification",
                success:false,
                error
            })
    }
}

module.exports= {
    getAllUserNotification,
    markAsRead,
    deleteNotification
};