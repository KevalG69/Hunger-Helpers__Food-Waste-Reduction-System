
//Modules
const VolunteerHelpRouter = require("express").Router();

//Controllers
const { createVolunteerHelp,getAllHelpRequest,
            getHelpRequestById,updateHelpRequest,
            deleteHelpRequest} 
        = require("../controllers/VolunteerHelpController.js");

//Middlewares
const { verifyToken, isMangerOrSelf } = require("../middlewares/authValidator.js");
const { canRequestHelp}= require("../middlewares/rolePermValidator.js");

//----------------------APIs

//GET /api/help-requests/ → Get all help requests
VolunteerHelpRouter.get('/',verifyToken,canRequestHelp,getAllHelpRequest);

//GET /api/help-requests/:id → Get help request details
VolunteerHelpRouter.get('/id',verifyToken,canRequestHelp,getHelpRequestById);

//POST /api/help-requests/ → Create a new help request
VolunteerHelpRouter.post("/create",verifyToken,canRequestHelp,createVolunteerHelp,);

//PUT /api/help-requests/:id → Update help request
VolunteerHelpRouter.put("/",verifyToken,isMangerOrSelf,updateHelpRequest);

//DELETE /api/help-requests/:id → Cancel a help request
VolunteerHelpRouter.delete("/",verifyToken,isMangerOrSelf,deleteHelpRequest);


module.exports = VolunteerHelpRouter;