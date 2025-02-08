//Modules

//Models
const UserModel = require("../models/User.js");

//Middlewares


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
module.exports = {
    GetAllUsers,
    GetUserByidentifier
}