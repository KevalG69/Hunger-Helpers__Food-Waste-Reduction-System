//Modules

//Middlewares

//Models
const DonationBoxModel = require("../models/Donation_Box.js");
const VolunteerHelpModel = require("../models/Volunteer_Help.js")

//Fuctions

const createVolunteerHelp = async (req,res)=>{

    try
    {
        //extractin data
        const {donationBoxId} = req.query;
        const volunteerHelpData = req.body;
        const volunteerId = req.user.id;

        //finding donation box id
        const donation_box = await DonationBoxModel.findById(donationBoxId);

        //checking donation box exist
        if(!donation_box)
        {
            return res.status(404)
                    .json({
                        message:"Donation Box NOT FOUND",
                        success:false
                    })
        }

        //checking donation box eligible
        if(donation_box.status!="Claimed" && donation_box.volunteer_id != volunteerId)
        {
            return res.status(403)
                    .json({
                        message:`Cannot Request Help Its Not your Box or (Donation Box is ${donation_box.status})`,
                        success:false
                    })
        }

        //if request already exist
        const volunteerHelpModel = await VolunteerHelpModel.findOne({donation_id:donationBoxId});

        if(volunteerHelpModel)
        {
            return res.status(403)
                    .json({
                        message:"Request Already Sent",
                        success:false
                    })
        }
        
        //if request does not exist
        const volunteerHelp = new VolunteerHelpModel(volunteerHelpData);

        const helpId = await volunteerHelp.save();

         //activityLogger
         await activityLogger(req.user.id, "Created Volunteer Help Request", "volunteer-help/create/:id", {
            VolunteerHelpId:helpId.id,
            DonationBoxId: donation_box.id,
            DonationName: donation_box.food_name,
            DonorId: donation_box.user_id,
            VolunteerId: donation_box.volunteer_id,
            VolunteerName: `${req.user.firstName} ${req.user.lastName}`,
        });

        res.status(200)
            .json({
                message:"Help Request Created Successfully",
                success:true,
                data:helpId
            })
    }
    catch(error)
    {
        console.error(error);
        res.status(500)
            .json({
                message:"Failed To Request Help",
                success:false,
                data:null,
                error
            })
    }


}

module.exports = {
    createVolunteerHelp
}





