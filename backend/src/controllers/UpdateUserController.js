//Modules

//Models
const UserModel = require("../models/User.js")

//Middlewares


const UpdateUserProfile = async (req,res)=>{

    try
    {
        //getting data
        console.log(req.params.id,req.query)
        const {id} = req.query;
        const updatedData = req.body;

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

        const restrictedFields = ['role','password','_id','createdAt','updatedAt','email','mobile'];

        restrictedFields.forEach(field => delete updatedData[field]);

        //merging changes to user in database

        Object.assign(user,updatedData)
        user.updatedAt = Date.now();

        //saving user changes
        await user.save();


        //activityLogger
        await activityLogger(user.id,"User Profile Updated","users/profile",{
            ByUserId:req.user.id,
            UserEmail:req.user.email,
            UserMobile:req.user.mobile
           
        })

        //sending response
        res.status(200)
            .json({
                message:"User Profile Updated Successfully",
                success:true
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

const UpdateUserRole = async (req,res)=>{
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
        if(user.role=="Admin")
        {
            return res.status(403)
                    .json({
                        message:"Cannot Make User Admin",
                        success:false
                    })
        }

        //making changes to user in database

        user.role = role;
        user.updatedAt = Date.now();

        //saving user changes
        await user.save();


         //activityLogger
         await activityLogger(user.id,"User Role Updated","users/role",{
            ByUserId:req.user.id,
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

const UpdateUserIdentifier = async (req,res)=>{
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


module.exports = {
    UpdateUserProfile,
    UpdateUserRole,
    UpdateUserIdentifier
}