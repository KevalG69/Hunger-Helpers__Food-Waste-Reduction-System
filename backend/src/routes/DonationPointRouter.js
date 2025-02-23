
//Modules
const DonationPointRouter = require("express").Router();



//Controllers
const {getAllDonationPoints,getDonationPointById, createDonationPoint, updateDonationPoint, deleteDonationPoint} 
            = require("../controllers/DonationPointController.js");

//Middlewares
const { verifyToken } = require("../middlewares/authValidator");
const donationPointValidator = require("../middlewares/donationPointValidator.js");
const {canTrackDonationPoint,canCreateDonationPoint} = require("../middlewares/rolePermValidator.js");

//Functions


//-------------APIs DonationPointRouter

//GET /api/donation-points/ → Get all donation points
DonationPointRouter.get("/",verifyToken,canTrackDonationPoint,getAllDonationPoints);

//GET /api/donation-points/:id → Get donation point details by ID
DonationPointRouter.get("/id",verifyToken,canTrackDonationPoint,getDonationPointById);

//POST /api/donation-point/create -> create donation point
DonationPointRouter.post("/create",verifyToken,canCreateDonationPoint,donationPointValidator,createDonationPoint);

//PUT /api/donation-points/:id → Update donation point details (Manager Only)
DonationPointRouter.put("/",verifyToken,canCreateDonationPoint,donationPointValidator,updateDonationPoint);

//DELETE /api/donation-points/:id → Delete a donation point (Manager Only)
DonationPointRouter.delete("/",verifyToken,canCreateDonationPoint,deleteDonationPoint);


module.exports = DonationPointRouter;