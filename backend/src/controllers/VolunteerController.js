//Modules

//models
const UserModel = require("../models/User.js");
const DonationBoxModel = require("../models/Donation_Box.js");
const VolunteerDDModel = require("../models/Volunteer_Donation_Delivery.js");
const RequestModel = require("../models/Request.js");

//Functions
const activityLogger = require("../functions&utils/activityLogger.js");

const assignVolunteer = async (req, res) => {

    try {
        //getting id
        const { requestId } = req.query;
        const { donationBoxId } = req.body;

        //checking if Request is available
        const requestModel = await RequestModel.findById(requestId);

        if (!requestModel) {
            return res.status(404)
                .json({
                    message: "No Request FOUND",
                    success: false
                });
        }
        else if (requestModel.askedTo != "Assign-me" || requestModel.donationBoxId != donationBoxId) {
            return res.status(404)
                .json({
                    message: "No Request FOUND",
                    success: false
                });
        }


        //getting volunteer
        // Check if the volunteer exists
        const volunteer = await UserModel.findById(requestModel.requestedFrom).populate("assigned_donations").exec();

        if (!volunteer) {
            return res.status(404).json({
                message: "Volunteer not found",
                success: false
            });
        }

        // Check if the donation exists
        const donation_box = await DonationBoxModel.findById(donationBoxId);
        if (!donation_box) {
            return res.status(404).json({
                message: "Donation not found",
                success: false
            });
        }





        //only if donation is Claimed
        if (donation_box.status != "Claimed") {
            return res.status(403)
                .json({
                    message: `Cannot Assing Donation Box is ${donation_box.status}`,
                    success: false
                })
        }

        //checking volunteer already assigned
        if (donation_box.assistingVolunteer.includes(volunteer.id)) {
            return res.status(403)
                .json({
                    message: "Volunteer Already Assigned",
                    success: false
                })
        }


        //assigning donation box
        donation_box.assistingVolunteer.push(volunteer.id);
        const volunteerDDmodel = new VolunteerDDModel({
            volunteer_id: req.user.id,
            donation_id: donation_box.id,
            type: "Assisting",
            status: 'Claimed'
        })


        //saving database
        await donation_box.save();
        const vDDid = await volunteerDDmodel.save();
    
        //pushing 
        volunteer.assigned_donations.push(vDDid.id);

        await volunteer.save()
        
        //deleting request 
        await RequestModel.findByIdAndDelete(requestId);
        //activityLogger
        await activityLogger(req.user.id, "Assigned Volunteer", "volunteer/assign/:id", {
            DonationBoxId: donation_box.id,
            DonationName: donation_box.food_name,
            DonorId: donation_box.user_id,
            VolunteerId: donation_box.volunteer_id,
            AssignedTo: volunteer.id
        });

        res.status(200)
            .json({
                message: "Volunteer Assigned Successfully",
                success: true
            })
    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Failed To Assign Volunteer",
                success: false,
                error
            })
    }
}

const requestAssignVolunteer = async (req, res) => {

    try {
        //getting id
        const { volunteerId } = req.query;
        const { donationBoxId } = req.body;

        //getting volunteer
        // Check if the volunteer exists
        const volunteer = await UserModel.findById(volunteerId).populate("assigned_donations").exec();

        if (!volunteer) {
            return res.status(404).json({
                message: "Volunteer not found",
                success: false
            });
        }

        // Check if the donation exists
        const donation_box = await DonationBoxModel.findById(donationBoxId);
        if (!donation_box) {
            return res.status(404).json({
                message: "Donation not found",
                success: false
            });
        }


        if (donation_box.status != "Claimed") {
            return res.status(403)
                .json({
                    message: `Cannot Request This Donation Box is ${donation_box.status}`,
                    success: false
                })
        }
        //if exists

        //checkin volunteer already requested
        const requests = await RequestModel.find({
            requestedFrom: volunteer.id
        })

        //checking each requests 
        if (requests.length != 0) {
            requests.forEach((request) => {
                if (request.askedTo == "Assign-me" && request.donationBoxId == donationBoxId) {
                    return res.status(403)
                        .json({
                            message: "Already Requested",
                            success: false
                        })
                }
            })
        }

        //if no request for this donation from volunteer
        const requestModel = new RequestModel({
            type: "Assign-Request",
            requestedFrom: volunteer.id,
            requestedFrom_firstName: volunteer.firstName,
            requestedFrom_lastName: volunteer.lastName,
            requestedTo: donation_box.volunteer_id,
            askedTo: "Assign-me",
            donationBoxId: donation_box.id,
            status: "Pending",
        })

        await requestModel.save();

        res.status(200)
            .json({
                message: "Assign Request Sent Successfully",
                success: true
            })

    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Failed to Request Send Request",
                success: false,
                error
            })
    }
}

const cancelRequest = async (req, res) => {

    try {
        //getting id
        const { requestId } = req.query;
        const { donationBoxId } = req.body;


        //checking if Request is available
        const requestModel = await RequestModel.findById(requestId);
        console.log(requestModel)
        if (!requestModel) {
            return res.status(404)
                .json({
                    message: "No Request FOUND (does not Exist)",
                    success: false
                });
        }
        else if (requestModel.askedTo != "Assign-me" || requestModel.donationBoxId != donationBoxId) {
            return res.status(404)
                .json({
                    message: "No Request FOUND (Wrong Type)",
                    success: false
                });
        }

        //if request found

        //deleting request
        await RequestModel.findByIdAndDelete(requestId);


        //sending respons
        res.status(200)
            .json({
                message: "Cancelled Request Successfully",
                success: true
            })
    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Failed to Cancel Request",
                success: false,
                error
            })
    }
}

const cancelAssignedVolunteer = async (req, res) => {

    try {
        //getting id
        const volunteerId  = req.user.id;
        const { donationBoxId } = req.body;


        //getting volunteer
        // Check if the volunteer exists
        const volunteer = await UserModel.findById(volunteerId).populate("assigned_donations").exec();

        if (!volunteer) {
            return res.status(404).json({
                message: "Volunteer not found",
                success: false
            });
        }

        // Check if the donation exists
        const donation_box = await DonationBoxModel.findById(donationBoxId);
        if (!donation_box) {
            return res.status(404).json({
                message: "Donation not found",
                success: false
            });
        }


        //only if donation is Claimed
        if (donation_box.status != "Claimed") {
            return res.status(403)
                .json({
                    message: `Cannot Cancel Assigned Volunteer (Donation Box is ${donation_box.status})`,
                    success: false
                })
        }

        //checking volunteer already assigned
        if (!donation_box.assistingVolunteer.includes(volunteer.id)) {
            return res.status(403)
                .json({
                    message: "Volunteer is NOT Assigned",
                    success: false
                })
        }

        //canceling volunteer from assigned
        await DonationBoxModel.findByIdAndUpdate(donationBoxId,
            { $pull: { assistingVolunteer: volunteerId } },
            { new: true }
        )

        const vDDmodel = await VolunteerDDModel.findOne({ volunteer_id: volunteerId });

        await UserModel.findByIdAndUpdate(volunteerId,
            { $pull: { assigned_donations: vDDmodel.id } }
        );

        await VolunteerDDModel.findOneAndDelete({ volunteer_id: volunteerId });

        //activityLogger
        await activityLogger(req.user.id, "Cancelled Assigned Volunteer", "volunteer/assign-cancel/:id", {
            AssignedTo: volunteer.id,
            VolunteerId: donation_box.volunteer_id,
            DonorId: donation_box.user_id,
            DonationBoxId: donation_box.id,
            DonationName: donation_box.food_name,
        });

        //response
        res.status(200)
            .json({
                message:"Cancelled Assigned Volunteer Successfully",
                success:true
            })

    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Failed to Cancel Assigned Donation Box",
                success: false,
                error
            })
    }
}

const getAssignedDonationBox = async (req, res) => {

    try {
        //getting volunteer id
        const { volunteerId } = req.query;

        //finding volunteer
        const volunteer = await UserModel.findById(volunteerId).populate("assigned_donations").exec();

        //if use does not exist 
        if (!volunteer) {
            return res.status(404)
                .json({
                    message: "Volunteer NOT FOUND",
                    success: false
                })
        }

        console.log(volunteer.assigned_donations);

        if (volunteer.assigned_donations.length == 0) {
            return res.status(404)
                .json({
                    message: "No Assigned Donation Box",
                    success: false
                })
        }


        const assigned_donations = volunteer.assigned_donations;
        console.log(assigned_donations, volunteer.assigned_donations)

        res.status(200)
            .json({
                message: "Fetched Assigned Donation Box Successfully",
                success: true,
                assigned_donations
            })
    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Failed To Get Assigned Donation Box",
                success: false,
                error
            })
    }
}

module.exports = {
    getAssignedDonationBox,
    requestAssignVolunteer,
    assignVolunteer,
    cancelRequest,
    cancelAssignedVolunteer

}