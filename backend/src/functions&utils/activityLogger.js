//Modules

//Models
const ActivityLogModel = require("../models/Activity_Log.js");
const UserModel = require("../models/User.js")
//


const activityLogger = async (userId, activityType, endPoint, metadata = {}) => {

    try 
    {
        const newLog = new ActivityLogModel({
            user_id: userId,
            activity_type: activityType,
            endpoint: endPoint,
            metadata
        })

        const savedLog  = await newLog.save();

        await UserModel.findByIdAndUpdate(userId,{
            $push:{ activity_logs: savedLog.id}
        })
        console.warn("Activity Logged")
    }
    catch (error) {
        console.error("Activity log error = ",error)
    }


}


module.exports = activityLogger;