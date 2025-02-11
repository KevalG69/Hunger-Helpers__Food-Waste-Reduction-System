
//Modules
const DonationBoxRouter = require("express").Router();

//Models

//Controllers
const {createDonationBox,getAllDonations, getDonationById, updateDonationBox, acceptDonationBox} 
        = require("../controllers/DonationBoxController.js")

//Middlewares
const { verifyToken, isMangerOrSelf ,notSelf} = require("../middlewares/authValidator.js");
const donationBoxValidator = require("../middlewares/donationBoxValidator.js");
const { canCreateDonation, canViewDonations,canClaimDonation } = require("../middlewares/rolePermValidator.js")

//functions


//---------------------APIs

//- POST /api/donations/ → Create a new donation

DonationBoxRouter.post("/create",verifyToken,canCreateDonation,donationBoxValidator,createDonationBox);

//GET /api/donations/ → Get all donations
DonationBoxRouter.get("/",verifyToken,canViewDonations,getAllDonations);

//GET /api/donations/:id → Get donation by ID
DonationBoxRouter.get("/id",verifyToken,canViewDonations,getDonationById);


//PUT /api/donations/:id → Update donation details
DonationBoxRouter.put("/update",verifyToken,isMangerOrSelf,donationBoxValidator,updateDonationBox);

//PUT /api/donations/accept -> accept donations
DonationBoxRouter.post("/accept",verifyToken,notSelf,canClaimDonation,acceptDonationBox);

//DELETE /api/donations/:id → Delete a donation

module.exports = DonationBoxRouter;