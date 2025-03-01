//Modules

//Middlewares

//Models
const DonationBoxModel = require("../models/Donation_Box.js");
const VolunteerHelpModel = require("../models/Volunteer_Help.js")

//Fuctions
const activityLogger = require("../functions&utils/activityLogger.js")


const getAllHelpRequest = async (req, res) => {
    try {
        //extracting data   
        const { page = 1, limit = 10, sort = "createdAt", type, volunteer } = req.body;

        const query = {};

        if (type) query.status = type;
        if (volunteer) query.volunteer_id = volunteer;

        const helpRequests = await VolunteerHelpModel.find(query)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort(sort);


        const total = await VolunteerHelpModel.countDocuments(query);

        //checking if request Exist
        if (!helpRequests) {
            return res.status(404)
                .json({
                    message: "Help Requests NOT FOUND",
                    success: false,
                    data: [],
                    total,
                    page,
                    limit
                })
        }

        //if requests found
        res.status(200)
            .json({
                message: "Fetched Requests Successfully",
                success: true,
                data: helpRequests,
                total,
                page,
                limit
            })

    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Failed to Fetch Requests",
                success: false,
                data: [],
                total,
                page,
                limit
            })
    }
}

const getHelpRequestById = async (req, res) => {
    try {
        //getting id
        const { helpRequestId } = req.query;

        //finding request
        const helpRequest = await VolunteerHelpModel.findById(helpRequestId);

        //checking if request exist
        if (!helpRequest) {
            return res.status(404)
                .json({
                    message: "Help Request NOT FOUND",
                    success: false,
                    data: null
                })
        }

        //if request exist
        res.status(200)
            .json({
                message: "Fetched Help Request Successfully",
                success: true,
                data: helpRequest
            })

    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Failed to Fetch Request",
                success: false,
                data: null,
                error
            })
    }
}

const createVolunteerHelp = async (req, res) => {

    try {
        //extractin data
        const { donationBoxId } = req.query;
        const {description} = req.body;
        const volunteerId = req.user.id;

        //finding donation box id
        const donation_box = await DonationBoxModel.findById(donationBoxId);

        //checking donation box exist
        if (!donation_box) {
            return res.status(404)
                .json({
                    message: "Donation Box NOT FOUND",
                    success: false
                })
        }

        //checking donation box eligible
        if (donation_box.status != "Claimed" && donation_box.volunteer_id != volunteerId) {
            return res.status(403)
                .json({
                    message: `Cannot Request Help Its Not your Box or (Donation Box is ${donation_box.status})`,
                    success: false
                })
        }

        //if request already exist
        const volunteerHelpModel = await VolunteerHelpModel.findOne({ donation_id: donationBoxId });

        if (volunteerHelpModel) {
            return res.status(403)
                .json({
                    message: "Request Already Sent",
                    success: false
                })
        }

        //if request does not exist
        const volunteerHelp = new VolunteerHelpModel({
            volunteer_id: volunteerId,
            donation_id: donationBoxId,
            description: description
        });

        const helpId = await volunteerHelp.save();

        //activityLogger
        await activityLogger(req.user.id, "Created Volunteer Help Request", "volunteer-help/create/:id", {
            VolunteerHelpId: helpId.id,
            DonationBoxId: donation_box.id,
            DonationName: donation_box.food_name,
            DonorId: donation_box.user_id,
            VolunteerId: donation_box.volunteer_id,
            VolunteerName: `${req.user.firstName} ${req.user.lastName}`,
        });

        res.status(200)
            .json({
                message: "Help Request Created Successfully",
                success: true,
                data: helpId
            })
    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Failed To Request Help",
                success: false,
                data: null,
                error
            })
    }



}

const updateHelpRequest = async (req, res) => {
    try {
        //extracting Data
        const { helpRequestId } = req.query;
        const { description, status } = req.body;

        //finding request
        const helpRequest = await VolunteerHelpModel.findById(helpRequestId);

        //checking if request Exist
        if (!helpRequest) {
            return res.status(404)
                .json({
                    message: "Help Request NOT FOUND",
                    success: false,
                    data: null
                })
        }

        //if Exist

        //checking if requets is eligible
        if (helpRequest.status != "Open") {
            return res.status(403)
                .json({
                    message: `Cannot Updated (Help Request is ${helpRequest.status}`,
                    success: false,
                    data: null
                })
        }

        helpRequest.description = description;
        helpRequest.status = status;
        helpRequest.resolvedAt=Date.now();
        await helpRequest.save();

        //activityLogger
        await activityLogger(req.user.id, "Updated Volunteer Help Request", "volunteer-help/update/:id", {
            HelpRequestId: helpRequest.id,
            updaterName: `${req.user.firstName} ${req.user.lastName}`,
            DonationBoxId: helpRequest.donation_id,
            VolunteerId: helpRequest.volunteer_id,
        });

        res.status(200)
            .json({
                message: "Updated Request Successfully",
                success: true,
                data: helpRequest
            })

    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Failed to update Help Request",
                success: false,
                data: null,
                error
            })
    }
}

const deleteHelpRequest = async (req, res) => {
    try {
        //extracting data
        const { helpRequestId } = req.query;

        //finding help request
        const helpRequest = await VolunteerHelpModel.findById(helpRequestId);

        //checking if help request exist 
        if (!helpRequest) {
            return res.status(404)
                .json({
                    message: "Help Request NOT FOUND",
                    success: false
                })
        }

        await VolunteerHelpModel.findByIdAndDelete(helpRequestId);
        
        //activityLogger
        await activityLogger(req.user.id, "Deleted Volunteer Help Request", "delete volunteer-help/:id", {
            HelpRequestId: helpRequest.id,
            deleterName: `${req.user.firstName} ${req.user.lastName}`,
            DonationBoxId: helpRequest.donation_id,
            VolunteerId: helpRequest.volunteer_id,
        });

        res.status(200)
            .json({
                message: "Deleted Help Request",
                success: true
            })
    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Failed to Delete Help Request",
                success: false
            })
    }
}

module.exports = {
    createVolunteerHelp,
    getAllHelpRequest,
    getHelpRequestById,
    updateHelpRequest,
    deleteHelpRequest
}





