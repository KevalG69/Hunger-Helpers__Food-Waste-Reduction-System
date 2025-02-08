//Modules

//Models
const UserModel = require("../models/User.js")

//Middlewares


const UpdateUserProfile = async (req,res)=>{

    try
    {
        //getting data
        const id = req.params.id;
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

        //restrcting fields

        const restrictedFields = ['role','password','_id','createdAt','updatedAt','email','mobile'];

        restrictedFields.forEach(field => delete updatedData[field]);

        //merging changes to user in database

        Object.assign(user,updatedData)
        user.updatedAt = Date.now();

        //saving user changes
        await user.save();

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

module.exports = {
    UpdateUserProfile
}