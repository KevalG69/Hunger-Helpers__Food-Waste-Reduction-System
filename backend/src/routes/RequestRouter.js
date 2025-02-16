
//Modules
const RequestRouter = require("express").Router();

//Controllers
const {getUserRequests} = require("../controllers/RequestController.js");

//Middlewares
const { verifyToken, isMangerOrSelf } = require("../middlewares/authValidator");


RequestRouter.get("/user",verifyToken,isMangerOrSelf,getUserRequests);


module.exports = RequestRouter;