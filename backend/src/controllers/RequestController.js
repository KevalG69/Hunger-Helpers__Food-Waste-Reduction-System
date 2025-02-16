//Modules


//Models
const RequestModel = require("../models/Request.js");

//Middlewares

const getUserRequests = async (req,res)=>{

    try
    {
        //getting user id
        const {userId} = req.query;

        //checking request for user
        const requests = await RequestModel.find({
            $or:[{requestedFrom:userId},{requestedTo:userId}]
        })
        .sort("createdAt");

        //if request does not exist
        if(!requests)
        {
            return res.status(404)
                    .json({
                        message:"No any Requests Found for User",
                        success:false
                    })
        }

        //if user request Exist

        res.status(200)
                .json({
                    message:"Requests Fatched Successfully",
                    success:true,
                    requests
                })

    }
    catch(error)
    {
        console.error(error);
        res.status(500)
            .json({
                message:"Failed to Fetch Requests",
                success:false,
                error
            })
    }
}

module.exports = {
    getUserRequests
}