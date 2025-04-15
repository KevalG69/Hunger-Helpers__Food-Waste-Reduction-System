
//Modules
const DonationBoxRouter = require("express").Router();

//Models

//Controllers
const { createDonationBox, getAllDonations,
        getDonationById, updateDonationBox,
        acceptDonationBox, cancelDonationBox,
        deleteDonationBox, claimDonationBox ,
        claimConfirm, claimDenied,
        markAsDelivered}
        = require("../controllers/DonationBoxController.js")

const {updateVolunteerLocation }= require("../controllers/updateVolunteerLocation.js");


//Middlewares
const { verifyToken, isMangerOrSelf, notSelf, isSelf, isManager } = require("../middlewares/authValidator.js");
const donationBoxValidator = require("../middlewares/donationBoxValidator.js");
const { canCreateDonation, canViewDonations, canClaimDonation, canDeleteDonation }
        = require("../middlewares/rolePermValidator.js")

//functions
const upload = require("../functions&utils/uploadImage.js");

//---------------------APIs


//GET /api/donations/ → -->Get all<--  donations
DonationBoxRouter.get("/", verifyToken, canViewDonations, getAllDonations);

//GET /api/donations/:id → Get donation by ID
DonationBoxRouter.get("/id", verifyToken, canViewDonations, getDonationById);



//- POST /api/donations/ → -->Create<--  a new donation
DonationBoxRouter.post("/create", verifyToken, canCreateDonation,upload.single("food_image"), donationBoxValidator,createDonationBox);


//PUT /api/donations/accept -> accept donations
DonationBoxRouter.post("/accept", verifyToken, notSelf, canClaimDonation, acceptDonationBox);

//POST /api/donations/cancel -> cancel Acepted donation - volunteer
DonationBoxRouter.post("/cancel-volunteer", verifyToken, canClaimDonation, cancelDonationBox);

//POST /api/donations/cancel -> cancel Created donation - donor
DonationBoxRouter.post("/cancel-donor", verifyToken, isSelf, cancelDonationBox);

//POST /api/donations/claim-volunteer → Claim a donation (NGO/Volunteer)
DonationBoxRouter.post("/claim-volunteer",verifyToken,notSelf,canClaimDonation,claimDonationBox);

//POST /api/donations/claim-volunteer → Claim Confirm (Donor)
DonationBoxRouter.post("/claim-confirm",verifyToken,isSelf,claimConfirm);

//POST /api/donations/claim-volunteer → Claim Confirm Denied (Donor)
DonationBoxRouter.post("/claim-denied",verifyToken,isSelf,claimDenied);

DonationBoxRouter.post('/update-location', verifyToken, updateVolunteerLocation);

//PUT /api/donations/:id → Update donation details
DonationBoxRouter.put("/update", verifyToken, isMangerOrSelf, donationBoxValidator, updateDonationBox);

//PUT /api/donations/manager-mark-delivered -> Manager confirm Delivery +update contribution_info
//for volunteer and donors
DonationBoxRouter.put("/delivered",verifyToken,isManager,markAsDelivered);


//DELETE /api/donations/:id → Delete a donation
DonationBoxRouter.delete("/id", verifyToken, canDeleteDonation, deleteDonationBox);

module.exports = DonationBoxRouter;