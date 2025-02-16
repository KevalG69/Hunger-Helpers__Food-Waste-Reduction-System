//Modules


//Models
const UserModel = require("../models/User.js");
const DonationBoxModel = require("../models/Donation_Box.js");
const VolunteerDDModel = require("../models/Volunteer_Donation_Delivery.js");
const RequestModel = require("../models/Request.js");

//functions
const activityLogger = require("../functions&utils/activityLogger.js");


const createDonationBox = async (req, res) => {

    try {
        //extracting data from req.body
        const { food_image,
            food_name,
            food_type,
            food_quantity,
            food_cookedAt,
            food_expireAt,
            pickup_location,
            location: { lat, lng },
            pickup_time } = req.body;

        //creating donation Box

        const donation_box = new DonationBoxModel({
            user_id: req.user.id,
            food_image,
            food_name,
            food_type,
            food_quantity,
            food_cookedAt,
            food_expireAt,
            pickup_location,
            location: { lat, lng },
            pickup_time
        })

        //saving donation Box
        const savedDonationBox = await donation_box.save();
        const sId = savedDonationBox.id;
        //pushing donation object id to in user
        await UserModel.findByIdAndUpdate(req.user.id, {
            $push: { donations: sId }
        })

        //activityLogger
        await activityLogger(req.user.id, "Created Donation Box", "post /donation-box/create", {
            DonationBoxId: sId,
            DonationBoxName: savedDonationBox.food_name,
        })

        res.status(200)
            .json({
                message: "Created Donation Box Successfully",
                success: true,
                donation_boxId: sId
            })

    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Failed to Create Donation Box",
                success: false,
                error
            })
    }

}

const getAllDonations = async (req, res) => {

    try {
        //query
        const { status, page = 1, limit = 10 } = req.query;
        const query = status ? status : {};

        //getting all donations according to query
        const donation_boxes = await DonationBoxModel.find(query)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 })

        //if there is no donation Box

        if (donation_boxes.length == 0) {
            return res.status(404)
                .json({
                    message: "No Donation Found",
                    success: false
                })
        }

        //if donations Found

        res.status(200)
            .json({
                message: "Fetched Donation Boxes Successfully",
                success: true,
                donation_boxes
            })

    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Failed To Fetch Donations",
                success: false,
                error
            })
    }
}

const getDonationById = async (req, res) => {

    try {
        //getting Donation id to Access
        const { donationBoxId } = req.query;

        //getting donation
        const donation_box = await DonationBoxModel.findById(donationBoxId);

        //if there is no donation Box

        if (!donation_box) {
            return res.status(404)
                .json({
                    message: "No Donation Found",
                    success: false
                })
        }

        //if donations Found

        res.status(200)
            .json({
                message: "Fetched Donation Box Successfully",
                success: true,
                donation_box
            })

    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Failed To Fetch Donation",
                success: false,
                error
            })
    }
}

const updateDonationBox = async (req, res) => {

    try {
        //extracting data from req.body
        const updatedData = req.body;


        const { donationBoxId } = req.query;

        //finding Donation Box
        const donation_box = await DonationBoxModel.findById(donationBoxId);

        //if donation does not exist
        if (!donation_box) {
            return res.status(404)
                .json({
                    message: "Donation Box Not Found",
                    success: false
                })
        }

        //only if donation is not pending
        if (donation_box.status != "Pending" && updatedData.status != "Cancelled") {
            return res.status(403)
                .json({
                    message: `Cannot Be Update (Donation is ${donation_box.status}) `,
                    success: false
                })
        }


        Object.assign(donation_box, updatedData);
        donation_box.updatedAt = Date.now();

        await donation_box.save();

        //activityLogger
        await activityLogger(donation_box.id, "Donation Box Updated", "donation-box/update/:id", {
            ByUserId: req.user.id,
            UserEmail: req.user.email,
            UserMobile: req.user.mobile,

        })

        //if updated
        res.status(200)
            .json({
                message: "Donation Box Updated",
                success: true
            })
    }
    catch (error) {

        console.error(error)
        res.status(500)
            .json({
                message: "Failed to Update Donation-Box",
                success: false,
                error
            })
    }
}

const acceptDonationBox = async (req, res) => {

    try {
        //getting request data
        const { donationBoxId } = req.query;

        //finding donation box
        const donation_box = await DonationBoxModel.findById(donationBoxId);

        //checkinf if donation Exist
        if (!donation_box) {
            return res.status(404)
                .json({
                    message: "Donation Box Not Found",
                    success: false
                })
        }

        //checking if donation is acceptable
        if (donation_box.status != "Pending") {

            return res.status(404)
                .json({
                    message: `Cannot Accept (donation box is ${donation_box.status})`,
                    success: false
                })
        }

        //accepting donation

        //1.updating volunteer_id in donation box
        donation_box.status = "Accepted"
        donation_box.volunteer_id = req.user.id;

        //2.updating and pushing assigne donation box to Volunteer account
        await UserModel.findByIdAndUpdate(req.user.id, {
            $push: { assigned_donations: donation_box.id }
        })

        //3.creating volunteer Donation Delivery 
        const volunteerDDmodel = new VolunteerDDModel({
            volunteer_id: req.user.id,
            donation_id: donation_box.id,
            status: 'Accepted'
        })

        //saving
        donation_box.save();
        volunteerDDmodel.save();


        //activityLogger
        await activityLogger(req.user.id, "Accepted Donation", "donation-box/accept/:id", {
            DonationBoxId: donation_box.id,
            DonatedBy: donation_box.user_id,
            VolunteerDonationDeliveryId: volunteerDDmodel.id,

        })

        //
        res.status(200)
            .json({
                message: "Donation Accepted",
                success: true,
                donation_box
            })
    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Failed to Accept Donation Box",
                success: false,
                error
            })
    }
}

const cancelDonationBox = async (req, res) => {

    try {
        //getting donation box id
        const { donationBoxId } = req.query;

        //getting Donation
        const donation_box = await DonationBoxModel.findById(donationBoxId);

        //if donation box does not Exist
        if (!donation_box) {
            return res.status(404)
                .json({
                    message: "Donaton Box Not Found",
                    success: false
                })
        }

        //if donation box exist

        //checking if donation box cancellable
        if (donation_box.status != "Pending" && donation_box.status != "Accepted") {
            //if volunteer cancelling

            return res.status(404)
                .json({
                    message: `Cannot cancel Donation Box is ${donation_box.status}`,
                    success: false
                })
        }

        //checking donation box creator canceling
        if (req.user.id == donation_box.user_id) {
            //changing donation box status to cancelled
            donation_box.status = "Cancelled";
            donation_box.save();
        }
        else if (req.user.id == donation_box.volunteer_id) {

            //getting volunteer donation deliver to update id to cancel
            const volunteerDDmodel = await VolunteerDDModel.findOne({ donation_id: donation_box.id });
            //updating
            volunteerDDmodel.status = "Cancelled";
            //changin donation box status back to pending
            donation_box.status = "Pending";

            volunteerDDmodel.save();
            donation_box.save();
        }
        else {
            return res.status(401)
                .json({
                    message: "Cannot Cancel Cause Was not Accepted By you",
                    success: false
                })
        }

        //activityLogger
        await activityLogger(req.user.id, "Cancelled Donation Box", "donation-box/cancel/:id", {
            DonationBoxId: donation_box.id,
            DonatedBy: donation_box.user_id,
            VolunteerId: donation_box.volunteer_id
        });

        //
        res.status(200)
            .json({
                message: "Cancelled Donation Box Successfully",
                success: true
            })

    }
    catch (error) {
        console.error(error)
        res.status(500)
            .json({
                message: "Failed to Cancel Donation Box",
                success: false,
                error
            })
    }
}

const deleteDonationBox = async (req, res) => {

    try
    {   
        //getting donation box id
        const {donationBoxId} = req.query;

        //finding donation Box
        const donation_box = await DonationBoxModel.findById(donationBoxId);

        //checking if donation box Exist
        if(!donation_box)
        {
            return res.status(404)
                    .json({
                        message:"Donation Box NOT FOUND",
                        success
                    })
        }

        //if donaton box exist

        //if donaton is claimed/deliverd/Accepted
        if(donation_box.status!="Pending"&&donation_box.status!="Cancelled"&&donation_box!="Expired")
        {
            return res.status(403)
                    .json({
                        message:`Cannot DELETE Donation is ${donation_box.status}`,
                        success:false
                    })
        }

        //deleting donation Box

        await DonationBoxModel.findByIdAndDelete(id);

        //activityLogger
        await activityLogger(req.user.id, "DELETE Donation Box", "delete donation-box/id/:id", {
            DonationBoxId: donation_box.id,
            DonatedBy: donation_box.user_id,
            VolunteerId: donation_box.volunteer_id
        });

        res.status(200)
            .json({
                message:"DELETED Donation Box Successfully",
                success:true
            })

    }
    catch(error)
    {
        console.error(error);
        res.status(500)
            .json({
                message:"Failed to DELETE Donation Box",
                success:true,
                error
            })
    }
}

const claimDonationBox = async (req,res)=>{

    try
    {
        //getting id
        const {donationBoxId} = req.query;

        console.log("Claim ")
        //finding donation box id
        const donation_box = await DonationBoxModel.findById(donationBoxId);
        console.log("got donation box")
        //if donation box does not exist
        if(!donation_box)
        {
            return res.status(404)
                    .json({
                        message:"Donatin Box NOT FOUND",
                        success:false
                    })
        }
        console.log("donation box exist")
        //if donation box exist

        //checking is it accept
        if(donation_box.status!="Accepted")
        {
            return res.status(403)
                    .json({
                        message:`Cannot Claim Donation is ${donation_box.status}`,
                        success:false
                    })
        }
        console.log("donation box accepted")
        //sending claim confirm request
        const requestModel = new RequestModel({
            type:"Claim-Confirm",
            requestedFrom:req.user.id,
            requestedTo:donation_box.user_id,            
            askedTo:"Claim",
            donationBoxId:donation_box.id,
            status:"Pending"
        })

        requestModel.save();
        console.log("saved")
         //activityLogger
         await activityLogger(req.user.id, "Claim Confirm Requested ", "donation-box/claim-volunteer/:id", {
            DonationBoxId: donation_box.id,
            DonationName:donation_box.food_name,
            RequestedTo: donation_box.user_id,
            VolunteerId: donation_box.volunteer_id
        });

        res.status(200)
            .json({
                message:"Claim Confirm Request Sent Successfully",
                success:true
            })
    }
    catch(error)
    {
        console.error(error);
        res.status(500)
            .json({
                message:"Failed to Claim",
                success:false,
                error
            })
    }
}


const claimConfirm = async(req,res)=>{

    try
    {
        //getting Request
        const {requestId} = req.body;

        //finding request in database
        const requestModel = await RequestModel.findById(requestId);

        //if request is not available
        if(!requestModel)
        {
            return res.status(404)
                    .json({
                        message:"No Request available",
                        success:false
                    })
        }

        //if request available

        //checking type of request
        if(requestModel.type != "Claim-Confirm")
        {
            return res.status(403)
                    .json({
                        message:"Not Claim-Confirm Request",
                        success:false
                    })
        }

        //getting claim request donation box
        const donation_box = await DonationBoxModel.findById(requestModel.donationBoxId);

        //checking if donation box available
        if(!donation_box)
        {
            return res.status(404)
                    .json({
                        message:"Donation Box NOT FOUND",
                        success:false
                    })
        }

        //checking donation box eligible
        if(donation_box.status != "Accepted")
        {
            return res.status(403)
                    .json({
                        message:"Cannot Confirm Claim For Donation Box",
                        success:false
                    })
        }


        //confirming claim

        await DonationBoxModel.findByIdAndUpdate(donation_box.id,{status:"Claimed"});
        await VolunteerDDModel.findOneAndUpdate({volunteer_id:donation_box.volunteer_id},{status:"Claimed"});
    
          //activityLogger
          await activityLogger(req.user.id, "Claim-Confirmed ", "donation-box/claim-confirm/:id", {
            DonationBoxId: donation_box.id,
            DonationName:donation_box.food_name,
            RequestedTo: donation_box.user_id,
            VolunteerId: donation_box.volunteer_id
        });

        //deleting request
        await RequestModel.findByIdAndDelete(requestId);


        //response
        res.status(200)
            .json({
                message:"Claim Confirmed",
                success:true
            });

    }
    catch(error)
    {
        console.error(error);
        res.status(500)
                .json({
                    message:"Failed To Confirm Claim",
                    success:false,
                    error
                });
    }
}

const claimDenied = async(req,res)=>{
    try
    {
        //getting Request
        const {requestId} = req.body;

        //finding request in database
        const requestModel = await RequestModel.findById(requestId);

        //if request is not available
        if(!requestModel)
        {
            return res.status(404)
                    .json({
                        message:"Request NOT FOUND",
                        success:false
                    })
        }

        //if request available

        //checking type of request
        if(requestModel.type != "Claim-Confirm")
        {
            return res.status(403)
                    .json({
                        message:"Not Claim-Confirm Request",
                        success:false
                    })
        }

        //getting claim request donation box
        const donation_box = await DonationBoxModel.findById(requestModel.donationBoxId);

        //checking if donation box available
        if(!donation_box)
        {
            return res.status(404)
                    .json({
                        message:"Donation Box NOT FOUND",
                        success:false
                    })
        }

       

        //deleting request
        await RequestModel.findByIdAndDelete(requestId);
    
          //activityLogger
          await activityLogger(req.user.id, "Claim-Denied ", "donation-box/claim-denied/:id", {
            DonationBoxId: donation_box.id,
            DonationName:donation_box.food_name,
            RequestedTo: donation_box.user_id,
            VolunteerId: donation_box.volunteer_id
        });


        //response
        res.status(200)
            .json({
                message:"Claim Denied",
                success:true
            });

    }
    catch(error)
    {
        console.error(error);
        res.status(500)
                .json({
                    message:"Failed To Denny Claim",
                    success:false,
                    error
                });
    }
}

const markAsDelivered = async (req,res)=>{

    try
    {
        //getting donation box id
        const {donationBoxId} = req.query;


        //finding donation box
        const donation_box = await DonationBoxModel.findById(id);

        //checking if it exist
        if(!donation_box)
        {
            return res.status(404)
                    .json({
                        message:"Donation Box NOT FOUND",
                        success:false
                    })
        }

        //if donation box exist

        //checking is it already claimed
        if(donation_box.status !="Claimed")
        {
            return res.status(403)
                    .json({
                        message:`Cannot Mark As Delivered Donation Box is ${donation_box.status}`,
                        success:false
                    })
        }

        //marking donation box deliverd and updating contribution of users

        await VolunteerDDModel.findOneAndUpdate({volunteer_id:donation_box.volunteer_id},{status:"Delivered"});
        donation_box.status ="Delivered";
        donation_box.save();

        //updating contribution info


        
          //activityLogger
          await activityLogger(req.user.id, "Donation Marked As Delivered ", "donation-box/delivered/:id", {
            DonationBoxId: donation_box.id,
            DonationName:donation_box.food_name,
            DonorId:donation_box.user_id,
            VolunteerId: donation_box.volunteer_id
        });
    }
    catch(error)
    {
        console.error(error);
        res.status(500)
            .json({
                message:"Failed to Mark Donation Box As Delivered",
                success:false,
                error
            })
    }
}
module.exports = {
    createDonationBox,
    getAllDonations,
    getDonationById,

    updateDonationBox,
    deleteDonationBox,
    acceptDonationBox,

    cancelDonationBox,
    claimDonationBox,
    claimConfirm,
    claimDenied,

    markAsDelivered
}