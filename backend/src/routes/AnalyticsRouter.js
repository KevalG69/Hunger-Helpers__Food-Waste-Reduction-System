
//Modules
const AnalyticsRouter = require("express").Router();

//Controller
const {getAllAnalytics}= require("../controllers/AnalyticsController");
//Functions
const { verifyToken } = require("../middlewares/authValidator");


//--------------------APIs

//GET /api/analytics/ → Get overall system analytics
//AnalyticsRouter.get("/",verifyToken,getAllAnalytics);


module.exports = AnalyticsRouter;