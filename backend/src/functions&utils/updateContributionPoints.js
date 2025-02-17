//Modules

const Contribution_Info = require("../models/Contribution_Info");
const UserModel = require("../models/User");

//Models


//Middlewares


//Functions
const {assignBadges} = require("./assignBadges");


const updateDonationPoints = async (userId)=>{

    try
    {
        //getting user and contribution info of user from database
        const user = await UserModel.findById(userId).populate("contribution_Info");

        //checking if user exist
        if(!user) return;
        if(!user.contribution_Info)
        {
            const contributionInfoModel = new Contribution_Info({
                    user_id:user.id,
                    last_contribution:Date.now()
            })
            user.contribution_Info =contributionInfoModel.id;
            
            await contributionInfoModel.save();
            await user.save();
        };

        const contribution_Info = await Contribution_Info.findById(user.contribution_Info);
        //updating user contribution info
        contribution_Info.donation_points += 10;//adding donation point to user
        contribution_Info.donation_count += 1; //adding number of Donations

        contribution_Info.last_contribution = Date.now();//updating last contribution date

        
        //adding new badges if user is eligible for it
        await assignBadges(contribution_Info,"donor");
    }
    catch(error)
    {
        console.error(error);
        return error;
    }
}

const updateVolunteerPoints = async (userId)=>{

    try
    {

        //getting user and contribution info of user from database
        const user = await UserModel.findById(userId).populate("contribution_Info");
        
        //checking if user exist
        if(!user) return;
        if(!user.contribution_Info)
        {
            const contributionInfoModel = new Contribution_Info({
                    user_id:user.id,
                    last_contribution:Date.now()
            })
            user.contribution_Info =contributionInfoModel.id;
            
            await contributionInfoModel.save();
            await user.save();
        };

        const contribution_Info = await Contribution_Info.findById(user.contribution_Info);
        //updating user contribution info
        contribution_Info.volunteer_points += 10;//adding donation point to user
        contribution_Info.completed_deliveries += 1; //adding number of Donations

        contribution_Info.last_contribution = Date.now();//updating last contribution date

        
        //adding new badges if user is eligible for it
        await assignBadges(contribution_Info,"donor");
    }
    catch(error)
    {
        console.error(error);
        return error;
    }
}
    
    module.exports = {
        updateDonationPoints,
        updateVolunteerPoints
    }