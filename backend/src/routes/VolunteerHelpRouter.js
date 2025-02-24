
//Modules
const VolunteerHelpRouter = require("express").Router();

//Controllers
const {createHelpRequest} = require("../controllers/VolunteerHelpController.js");

//Middlewares
const { verifyToken } = require("../middlewares/authValidator.js");
const { canRequestHelp}= require("../middlewares/rolePermValidator.js");

//----------------------APIs

VolunteerHelpRouter.get("/",verifyToken,canRequestHelp,createHelpRequest);


module.exports = VolunteerHelpRouter;