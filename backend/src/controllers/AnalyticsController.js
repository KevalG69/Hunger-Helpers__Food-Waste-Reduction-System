//Modules

//Models
const AnalyticDataModel = require("../models/Analytics_Data.js");
//middlewares

//function

const getAllAnalytics = async (req,res)=>{
    try
    {

    }
    catch(error)
    {
        console.error(error);
        res.status(500)
            .json({
                message:"Failed to Fetch Analytics Data",
                success:false,
                data:[],
                error
            })
    }
}

module.exports={
    getAllAnalytics
};