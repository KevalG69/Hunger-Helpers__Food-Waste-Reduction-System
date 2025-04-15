//Models
const leaderboardModel = require("../models/Leaderboard.js");

//middlewares

//function 

const getLeaderboard = async (req,res)=>{
    try
    {
        //getting all leaderboard
        const leaderboard = await leaderboardModel.find();

        //checkinf if leaderboard exist
        if(!leaderboard.length)
        {
            return res.status(404)
                    .json({
                        message:"Leaderboard NOT FOUND",
                        success:false,
                        data:[]
                    })
        }

        res.status(200)
                .json({
                    message:"Fetched Leaderboard Successfully",
                    success:true,
                    data:leaderboard
                })
    }
    catch(error)
    {
        console.error(error);
        res.status(500)
            .json({
                message:"Failed to Fetch Leaderboard",
                success:false,
                data:null,
                error
            })
    }

}

const getLeaderboardByType = async (req,res)=>{
    try
    {
        const {Type} = req.query;

        //finding leaderboard
        const leaderboard = await leaderboardModel.findOne({ranking_type:Type});

        //checking if leaderboard exist
        if(!leaderboard)
        {
            return res.status(404)
                        .json({
                            message:"Leaderboard NOT FOUND",
                            success:false,
                            data:null
                        })
        }

        res.status(200) 
            .json({
                message:"Fetched Leaderboard Successfully",
                success:true,
                data:leaderboard
            });
    }
    catch(error)
    {
        console.error(error);
        res.status(500)
            .json({
                message:"Failed to Fetch Leaderboard",
                success:false,
                data:null,
                error
            })
    }
}

module.exports = {
    getLeaderboard,
    getLeaderboardByType
}