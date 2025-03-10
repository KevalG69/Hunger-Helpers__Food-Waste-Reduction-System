//Modules 
const LeaderboardRouter = require("express").Router();

//Controller
const { getLeaderboard, getLeaderboardByRegion } = require("../controllers/LeaderboardController.js");

//Models 

//Middleware
const { verifyToken } = require("../middlewares/authValidator");

//function 


//GET /api/leaderboard/ → Get global leaderboard
LeaderboardRouter.get("/",verifyToken,getLeaderboard);

//GET /api/leaderboard/:region → Get leaderboard for a specific region
LeaderboardRouter.get("/region",verifyToken,getLeaderboardByRegion);


module.exports = LeaderboardRouter;