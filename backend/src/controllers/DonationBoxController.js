//Modules


//Models
const UserModel = require("../models/User.js");
const DonationBoxModel = require("../models/Donation_Box.js");
const VolunteerDDModel = require("../models/Volunteer_Donation_Delivery.js");

//functions
const activityLogger = require("../functions&utils/activityLogger.js")

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

        //pushing donation object id to in user
        await UserModel.findByIdAndUpdate(req.user.id, {
            $push: { donations: savedDonationBox.id }
        })

        //activityLogger
        await activityLogger(req.user.id, "Created Donation Box", "post /donation-box/create", {
            DonationBoxId: savedDonationBox.id,
            DonationBoxName: savedDonationBox.food_name,
        })

        res.status(200)
            .json({
                message: "Created Donation Box Successfully",
                success: true
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
        const { id } = req.query;

        //getting donation
        const donation_box = await DonationBoxModel.findById(id);

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


        const { id } = req.query;

        //finding Donation Box
        const donation_box = await DonationBoxModel.findById(id);

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
        const { id } = req.query;

        //finding donation box
        const donation_box = await DonationBoxModel.findById(id);

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
            $push: { assigned_donations:donation_box.id}
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
                message:"Donation Accepted",
                success:true,
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

module.exports = {
    createDonationBox,
    getAllDonations,
    getDonationById,

    updateDonationBox,

    acceptDonationBox
}