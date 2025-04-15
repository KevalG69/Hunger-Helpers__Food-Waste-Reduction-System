
//Modules
const AnalyticRouter = require("express").Router();

//Controller
const {getAllAnalytics, getAnalyticByRegion, updateAnalyticData,getDonationData}= require("../controllers/AnalyticController.js");
//Functions
const { verifyToken } = require("../middlewares/authValidator.js");
const {canViewAnalytics,canManageContent} = require("../middlewares/rolePermValidator.js");

//--------------------APIs

//GET /api/analytics/ → Get overall system analytics
AnalyticRouter.get("/",getAllAnalytics);

//GET /api/analytics/ → Get overall system analytics
AnalyticRouter.get("/donation-data",getDonationData);


//GET /api/analytics/region → Get donation analytics
AnalyticRouter.get("/region",canViewAnalytics,getAnalyticByRegion);

//PUT /api/analytics/ → update analytics data
AnalyticRouter.put("/",verifyToken,canManageContent,updateAnalyticData);

module.exports = AnalyticRouter;