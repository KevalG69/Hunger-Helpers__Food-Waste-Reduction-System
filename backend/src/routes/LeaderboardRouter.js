//Modules 
const LeaderboardRouter = require("express").Router();

//Controller
const { getLeaderboard, getLeaderboardByType } = require("../controllers/LeaderboardController.js");

//Models 

//Middleware


//function 


//GET /api/leaderboard/ → Get global leaderboard
LeaderboardRouter.get("/",getLeaderboard);

//GET /api/leaderboard/:region → Get leaderboard for a specific region
LeaderboardRouter.get("/type",getLeaderboardByType);


module.exports = LeaderboardRouter;