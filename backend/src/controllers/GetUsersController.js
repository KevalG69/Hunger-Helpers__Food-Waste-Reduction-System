//Modules

//Models

const UserModel = require("../models/User.js");
const ActivityLogModel = require("../models/Activity_Log.js");
const ContributionInfoModel = require("../models/Contribution_Info.js");
const Donations = require("../models/Donation_Box.js");
//Middlewares

//functions
const activityLogger = require("../functions&utils/activityLogger.js");
const GetAllUsers = async (req,res) =>{
 
    try//try and catch block to handle run time error
    {
        //getting all users
        const Users = await UserModel.find().select("-password");

        res.status(200)
            .json({
                message:"All Users Fatched Successfully",
                success:true,
                Users
            })
    }
    catch(error)
    {
        console.error(error)
        res.status(500)
            .json({
                message:"Internal Server Error At Get All Users",
                success:false
            })
    }
}

const GetUserByidentifier = async (req,res)=>{
    
    try
    {
        //getting user identifier
        const identifier = req.params.identifier;

        //getting user
        const user = await UserModel.findOne({
            $or:[{email:identifier},{mobile:identifier}]
        })

        //if user does not exist
        if(!user)        
        {
            return res.status(404)
                .json({
                    message:"User not Found",
                    success:false
                })
        }

        // if user exist
        res.status(200)
            .json({
                message:"User Fetched Successfully",
                success:true,
                user
            })
    }
    catch(error)
    {
        console.error(error);
        res.status(500)
            .json({
                message:"Internal Server Error At Getting User",
                success:false,
                error
            })
    }
}

const GetUserActivityLogs = async(req,res)=>{

    try
    {
        //getting User id
        const {id} = req.query;
        
        //getting User

        const user = await UserModel.findById(id).populate('activity_logs').exec();

        //if user does not exist
        if(!user)
        {
            res.status(404)
                    .json({
                        message:"User Not Found",
                        success
                    })
        }


        //if user found
        
         //activityLogger
         await activityLogger(req.user.id,"Fetched User Activity Logs","get users/:id/activity-logs",{
            UserId:user.id,
            UserEmail:user.email,
            UserMobile:user.mobile,
        })

        const activity_logs = user.activity_logs
        res.status(200)
            .json({
                message:"Fetched User Activity Logs Successfully",
                success:true,
                activity_logs
            })
    }
    catch(error)
    {
        console.error(error)
        res.status(500)
                .json({
                    message:"Failed to Fetched User's Activity Logs",
                    success:false,
                    error
                })
    }
}


const GetUserContributionInfo = async(req,res)=>{

    try
    {
        //getting User id
        const {id} = req.query;
        
        //getting User

        const user = await UserModel.findById(id).populate("contribution_info");

        //if user does not exist
        if(!user)
        {
            res.status(404)
                    .json({
                        message:"User Not Found",
                        success
                    })
        }


        //if user found
        
         //activityLogger
         await activityLogger(req.user.id,"Fetched User Contribution Info ","get users/contribution-info/:id",{
            UserId:user.id,
            UserEmail:user.email,
            UserMobile:user.mobile,
        })

        const contribution_info = user.contribution_info;
        res.status(200)
            .json({
                message:"Fetched User Contribution Info Successfully",
                success:true,
                contribution_info
            })
    }
    catch(error)
    {
        console.error(error)
        res.status(500)
                .json({
                    message:"Failed to Fetched User's Contribution Info",
                    success:false,
                    error
                })
    }
}

const GetUserDonations = async(req,res)=>{

    try
    {
        //getting User id
        const {id} = req.query;
        
        //getting User

        const user = await UserModel.findById(id).populate("donations").exec();

        //if user does not exist
        if(!user)
        {
            res.status(404)
                    .json({
                        message:"User Not Found",
                        success
                    })
        }


        //if user found
        
         //activityLogger
         await activityLogger(req.user.id,"Fetched User Donations Info ","get users/donations/:id",{
            UserId:user.id,
            UserEmail:user.email,
            UserMobile:user.mobile,
        })

        const donations = user.donations;
        res.status(200)
            .json({
                message:"Fetched User Donations Info Successfully",
                success:true,
                donations
            })
    }
    catch(error)
    {
        console.error(error)
        res.status(500)
                .json({
                    message:"Failed to Fetched User's Donations Info",
                    success:false,
                    error
                })
    }
}

module.exports = {
    GetAllUsers,
    GetUserByidentifier,
    GetUserActivityLogs,
    GetUserContributionInfo,
    GetUserDonations
}