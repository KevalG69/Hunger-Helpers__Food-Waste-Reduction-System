//Modules

//Models
const AnalyticDataModel = require("../models/Analytics_Data.js");

//middlewares

//function

const getAllAnalytics = async (req,res)=>{
    try
    {
        //query
         
        //find all analytics
        const analytics = await AnalyticDataModel.find();

        const total = await AnalyticDataModel.countDocuments();

        if(!analytics.length)
        {
            return res.status(404)
                    .json({
                        message:"Analytics Data NOT FOUND",
                        success:false,
                        data:[],
                        total
                    })
        }

        //if Found
        res.status(200)
            .json({
                message:"Fetched Analytics Data Successfully",
                success:true,
                data:analytics,
                total
            })
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

const getAnalyticByRegion = async (req,res)=>{
    try
    {
        const {region}= req.query;

        //finding analytictData
        const analytics = await AnalyticDataModel.findOne({region:region});

        if(!analytics)
        {
            return res.status(404)
                .json({
                    message:"Region Analytic NOT FOUND",
                    success:false,
                    data:null
                })
        }

        res.status(200)
            .json({
                message:"Fetched Analytic Data",
                success:true,
                data:analytics
            })
    }
    catch(error)
    {
        console.error(error);
        res.status(500) 
            .json({
                message:"Failed to Fetch Analytic Data",
                success:false,
                data:null,
                error
            })
    }
}

const updateAnalyticData = async (req,res)=>{
    try
    {
        const {analyticId} = req.query;
        const updatedAnalyticData = req.body;

        //finding analytic Data
        const analytic = await AnalyticDataModel.findById(analyticId);

        //checking if data exist
        if(!analytic)
        {
            return res.status(404)
                    .json({
                        message:"Analytic Data NOT FOUND",
                        success:false,
                        data:null
                    })
        }

        //if exist 
        Object.assign(analytic,updatedAnalyticData);
        analytic.updatedAt = Date.now();

        await analytic.save();

          //activityLogger
          await activityLogger(req.user.id, "Updated Analytic Data", "put /analytic/", {
            updaterId:req.user.id,
            updaterName:`${req.user.firstName} ${req.user.lastName}`,
            AnalyticDataId: analytic.id,
            AnalyticRegion: analytic.region
        });

        res.status(200)
            .json({
                message:"updated Analytic Data Successfully",
                success:true,
                data:analytic
            })

    }
    catch(error)
    {
        console.error(error);
        res.status(500)
            .json({
                message:"Failed to update Analytic Data",
                success:false,
                data:null
            })
    }
}

module.exports={
    getAllAnalytics,
    getAnalyticByRegion,
    updateAnalyticData
};