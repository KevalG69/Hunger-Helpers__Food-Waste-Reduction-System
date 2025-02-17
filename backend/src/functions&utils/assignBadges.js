//Modules

//Models


//Middlewares


//Functions


const assignBadges = async (contribution_Info,type)=>{

    try
    {

        if(type == "donor")
        {
            //if user is donor
            if(contribution_Info.donation_points >=10 && 
                !contribution_Info.badges.includes("Helping Hand"))
            {
            await contribution_Info.badges.push("Helping Hand");
            }
            else if(contribution_Info.donation_points >=50 && 
                !contribution_Info.badges.includes("Bronze Donor"))
            {
            await contribution_Info.badges.push("Bronze Donor");
            }
            else if(contribution_Info.donation_points >=100 && 
                !contribution_Info.badges.includes("Silver Donor"))
            {
            await contribution_Info.badges.push("Silver Donor");
            }
            else if(contribution_Info.donation_points >=200 && 
                !contribution_Info.badges.includes("Gold Donor"))
            {
            await contribution_Info.badges.push("Gold Donor");
            }
            else if(contribution_Info.donation_points >=300 && 
                !contribution_Info.badges.includes("Dimond"))
            {
            await contribution_Info.badges.push("Dimond");
            }
            else
            {
                return;
            }

        }
        else if(type== "volunteer")
        {
            if(contribution_Info.volunteer_points >=10 && 
                !contribution_Info.badges.includes("Helping Hand"))
            {
            await contribution_Info.badges.push("Helping Hand");
            }
            else if(contribution_Info.volunteer_points >=50 && 
                !contribution_Info.badges.includes("Bronze Volunteer"))
            {
            await contribution_Info.badges.push("Bronze Volunteer");
            }
            else if(contribution_Info.volunteer_points >=100 && 
                !contribution_Info.badges.includes("Silver Volunteer"))
            {
            await contribution_Info.badges.push("Silver Volunteer");
            }
            else if(contribution_Info.volunteer_points >=200 && 
                !contribution_Info.badges.includes("Gold Volunteer"))
            {
            await contribution_Info.badges.push("Gold Volunteer");
            }
            else if(contribution_Info.volunteer_points >=300 && 
                !contribution_Info.badges.includes("Dimond"))
            {
            await contribution_Info.badges.push("Dimond");
            }
            else 
            {
                return;
            }
    
        }
        await contribution_Info.save();
    }
    catch(error)
    {
        console.error(error);
        return error;
    }
}


module.exports = {assignBadges}