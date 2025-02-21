
//Modules
const VolunteerRouter = require("express").Router();

//Controllers
const {assignVolunteer, getAssignedDonationBox,
    cancelAssignedVolunteer,requestAssignVolunteer,
    cancelRequest} 
        = require("../controllers/VolunteerController.js");

//Middlewares
const { verifyToken, isManager, isMangerOrSelf } = require("../middlewares/authValidator");
const {canAssignVolunteers, canMonitorSystem, canClaimDonation} = require("../middlewares/rolePermValidator.js");

//Functions


//------------APIs

//POST /api/volunteers/:id/assign → Assign a donation to a volunteer
VolunteerRouter.post("/assign-request",verifyToken,canClaimDonation,requestAssignVolunteer);



//POST /api/volunteers/:id/assign → Assign a donation to a volunteer
VolunteerRouter.post("/assign-confirm",verifyToken,canAssignVolunteers,assignVolunteer);

//POST /api/volunteers/:id/assign-cancel → cancel Assign a donation to a volunteer
VolunteerRouter.post("/assign-req-cancel",verifyToken,isMangerOrSelf,cancelRequest);


//POST /api/volunteers/:id/assign-cancel → cancel Assign a donation to a volunteer
VolunteerRouter.post("/assign-cancel",verifyToken,isMangerOrSelf,cancelAssignedVolunteer);



//GET /api/volunteers/:id/assigned-donations → Get assigned donations for a volunteer
VolunteerRouter.get("/",verifyToken,isMangerOrSelf,getAssignedDonationBox);


module.exports = VolunteerRouter;