//Modules

//Models
const UserModel = require("../models/User.js")
const ContributionInfoModel = require("../models/Contribution_Info.js");
const NotificationModel = require("../models/Notification.js");

//Middlewares

//functions
const activityLogger = require("../functions&utils/activityLogger.js");

//Update User
const updateUserProfile = async (req,res)=>{

    try
    {
        //getting data
        console.log(req.params.id,req.query)
        const {userId} = req.query;
        const updatedData = req.body;

        //checking if user exist
        const user = await UserModel.findById(userId);

        //if user does not exist
        if(!user)
        {
            return res.status(404)
                .json({
                    message:"User not Found At Profile Update",
                    success:false
                })
        }

        //checking if user is Admin
        if(user.role=="Admin")
        {
            return res.status(403)
                .json({
                    message:"Cannot Update Admin Data",
                    success:false
                })
        }


        //restrcting fields

        const restrictedFields = ['password','_id','createdAt','updatedAt','email','mobile'];

        restrictedFields.forEach(field => delete updatedData[field]);

        const role = updatedData['role'];
        console.log(role)
        if(role=="Manger"||role=="Admin")
        {
            return res.status(403)
                .json({
                    message:"Access Denied",
                    success:false
                })
        }

        //merging changes to user in database

        Object.assign(user,updatedData)
        user.updatedAt = Date.now();

        //saving user changes
        const updatedUser = await user.save();


        //activityLogger
        await activityLogger(user.id,"User Profile Updated","users/profile",{
            ByUserId:req.user.id,
            ByUserName:`${req.user.firstName} ${req.user.lastName}`,
            UserEmail:req.user.email,
            UserMobile:req.user.mobile
           
        })

        //sending response
        res.status(200)
            .json({
                message:"User Profile Updated Successfully",
                success:true,
                data:updatedUser
            })

    }
    catch(error)
    {
        console.error(error)
        res.status(500)
            .json({
                message:"Failed To Update User Profile",
                success:false,
                error
            })
    }
}

const updateUserRole = async (req,res)=>{
    try
    {
        //getting data
        
        const {id} = req.query;
        const {role} = req.body;

        //checking if user exist
        const user = await UserModel.findById(id);

        //if user does not exist
        if(!user)
        {
            return res.status(404)
                .json({
                    message:"User not Found",
                    success:false
                })
        }

        //checking if role is admin or manager
        if(role=="Admin")
        {
            return res.status(403)
                    .json({
                        message:"Cannot Make User Admin",
                        success:false
                    })
        }

        if(user.role=="Admin")
            {
                return res.status(403)
                        .json({
                            message:"Cannot Change Role of Admin",
                            success:false
                        })
            }
    
            

        //making changes to user in database

        user.role = role;
        user.updatedAt = Date.now();

        //saving user changes
        await user.save();

        sendNotification(user.id,"Profile Update","Your Role is Updated!",
            {Donation_Id:donationBoxId,
            Donation_Name:donation_box.food_name,
            Donation_Type:donation_box.food_type,
            Donation_Quantity:donation_box.food_quantity}
        );
            //pushing notification object id to in user
        await UserModel.findByIdAndUpdate(user.id, {
            $push: { notifications: notificationId }
        });


         //activityLogger
         await activityLogger(user.id,"User Role Updated","users/role",{
            ByUserId:req.user.id,
            ByUserName:`${req.user.firstName} ${req.user.lastName}`,
            UserEmail:req.user.email,
            UserMobile:req.user.mobile
        })

        //sending response
        res.status(200)
            .json({
                message:"User Role Updated Successfully",
                success:true
            })

    }
    catch(error)
    {
        console.error(error)
        res.status(500)
            .json({
                message:"Failed To Update User Role",
                success:false,
                error
            })
    }
}

const updateUserIdentifier = async (req,res)=>{
    try
    {
        //getting data
        const {id} = req.query;
        const {email,mobile} = req.body;

        //checking if user exist
        const user = await UserModel.findById(id);

        //if user does not exist
        if(!user)
        {
            return res.status(404)
                .json({
                    message:"User not Found",
                    success:false
                })
        }

    
        //merging changes to user in database

        user.email=email;
        user.mobile=mobile;
        user.updatedAt = Date.now();

        //saving user changes
        await user.save();

          //activityLogger
          await activityLogger(user.id,"User Email/Mobile Updated","users/identifier",{
            ByUserId:req.user.id,
            ByUserName:`${req.user.firstName} ${req.user.lastName}`,
            UserEmail:req.user.email,
            UserMobile:req.user.mobile
           
        })

        //sending response
        res.status(200)
            .json({
                message:"User Email/Mobile Updated Successfully",
                success:true
            })

    }
    catch(error)
    {
        console.error(error)
        res.status(500)
            .json({
                message:"Failed To Update User Email/Mobile",
                success:false,
                error
            })
    }
}

const uploadUserProfilePhoto = async(req,res)=>{
    try
    {
        await UserModel.findByIdAndUpdate(req.user.id,{profilePhoto:req.file.path});
        
          //activityLogger
          await activityLogger(req.user.id,"Updated Profile Photo","users/upload-profile-photo",{
            ByUserId:req.user.id,
            ByUserName:`${req.user.firstName} ${req.user.lastName}`,
            UserEmail:req.user.email,
            UserMobile:req.user.mobile
        })

        res.status(200)
            .json({
                message:"Updated Profile Photo Successfully",
                success:true,
                imageUrl:req.file.path
            })
    }
    catch(error)
    {
        console.error(error);
        res.status(500)
            .json({
                message:"Failed to Upload Profile Photo",
                success:false,
                imageUrl:null,
                error
            })
    }
}

//Delete User Account
const deleteUser =  async (req,res)=>{

    try
    {
        //getting user
        const {id} = req.query;
        const {reason} = req.body;
        //finding user in database
        const user = await UserModel.findById(id);

        //if user does not exist
        if(!user)
        {
            return res.status(404)
                    .json({
                        message:"User Not Found",
                        success:false
                    })
        }

        //if user exist
        
        //checking if user is admin
        if(user.role=="Admin")
        {
            return res.status(404)
                    .json({
                        message:"Cannot Delete Admin",
                        success:false
                    })
        }

    
        //deleting user
        await ContributionInfoModel.deleteOne({user_id:id})
        await NotificationModel.deleteOne({user_id:id})
        
        await UserModel.findByIdAndDelete(id);
        
        //activityLogger
        await activityLogger(req.user.id,"Deleted User Account Contribution_Info,Notification","delete users/:id",{
            DeletedByName:`${req.user.firstName} ${req.user.lastName}`,
            DeletedUserId:user.id,
            UserEmail:user.email,
            UserMobile:user.mobile,
            Reason:reason  
        })
        
        res.status(200)
                .json({
                    message:"User Account Deleted Successfully",
                    success:true
                })
    }
    catch(error)
    {
        console.error(error)
        res.status(500)
            .json({
                message:"Failed To Delete User Account",
                success:false,
                error
            })
    }
}

module.exports = {
    updateUserProfile,
    updateUserRole,
    updateUserIdentifier,
    uploadUserProfilePhoto,
    deleteUser
}