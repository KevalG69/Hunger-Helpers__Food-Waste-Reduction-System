//Modules

//Models

const UserModel = require("../models/User.js");
const ActivityLogModel = require("../models/Activity_Log.js");
const ContributionInfoModel = require("../models/Contribution_Info.js");
const Donations = require("../models/Donation_Box.js");
//Middlewares

//functions
const activityLogger = require("../functions&utils/activityLogger.js");


const getAllUsers = async (req, res) => {

    try//try and catch block to handle run time error
    {
        //extracting data
        const { role, state, city, verified, limit = 10, page = 1, sort = "createdAt" } = req.query;

        //query
        const query = {};

        //filling query
        if (role) query.role = role
        if (state) query.state = state
        if (city) query.city = city
        if (verified) query.verified = verified



        //getting all users
        const Users = await UserModel.find(query)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort(sort)
            .select("-password");

        const total = await UserModel.countDocuments(query);

        //if not user Found
        if (Users.length == 0) {
            return res.status(404)
                .json({
                    message: "No User Found",
                    success: false,
                    data: [],
                    total,
                    page,
                    limit
                })
        }

        res.status(200)
            .json({
                message: "All Users Fatched Successfully",
                success: true,
                data: Users,
                total,
                page,
                limit
            })
    }
    catch (error) {
        console.error(error)
        res.status(500)
            .json({
                message: "Internal Server Error At Get All Users",
                success: false
            })
    }
}

const getUserByidentifier = async (req, res) => {

    try {
        //getting user identifier
        const identifier = req.params.identifier;

        //getting user
        const user = await UserModel.findOne({
            $or: [{ email: identifier }, { mobile: identifier }]
        })

        //if user does not exist
        if (!user) {
            return res.status(404)
                .json({
                    message: "User not Found",
                    success: false,
                    data: null
                })
        }

        // if user exist
        res.status(200)
            .json({
                message: "User Fetched Successfully",
                success: true,
                data: user
            })
    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Internal Server Error At Getting User",
                success: false,
                error
            })
    }
}

const getUserActivityLogs = async (req, res) => {

    try {
        // Extract query params
        let { page = 1, limit = 10, userId, activityType, startDate, endDate, sort, order } = req.query;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404)
                .json({
                    message: "User NOT FOUND",
                    success: false,
                    data: null,
                    total: 0,
                    page,
                    limit
                })
        }


        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        // Filters
        let filters = {};
        if (userId) filters.user_id = userId;
        if (activityType) filters.activity_type = new RegExp(activityType, "i"); // Case-insensitive search
        if (startDate || endDate) {
            filters.createdAt = {};
            if (startDate) filters.createdAt.$gte = new Date(startDate);
            if (endDate) filters.createdAt.$lte = new Date(endDate);
        }

        // Sorting
        let sortOptions = { createdAt: -1 }; // Default: Newest first
        if (sort) {
            order = order === "asc" ? 1 : -1;
            sortOptions = { [sort]: order };
        }

        // Fetch logs with filters & pagination
        const activity_logs = await ActivityLogModel.find(filters)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const total = await ActivityLogModel.countDocuments(filters);


        //activityLogger
        await activityLogger(req.user.id, "Fetched User Activity Logs", "get users/:id/activity-logs", {
            FetchedByName: `${req.user.firstName} ${req.user.lastName}`,
            UserId: user.id,
            UserEmail: user.email,
            UserMobile: user.mobile,
        })


        res.status(200)
            .json({
                message: "Fetched User Activity Logs Successfully",
                success: true,
                data: activity_logs,
                total,
                page,
                limit
            })
    }
    catch (error) {
        console.error(error)
        res.status(500)
            .json({
                message: "Failed to Fetched User's Activity Logs",
                success: false,
                error
            })
    }
}


const getUserContributionInfo = async (req, res) => {

    try {
        //getting User id
        const { userId } = req.query;

        //getting User

        const user = await UserModel.findById(userId).populate("contribution_Info");

        //if user does not exist
        if (!user) {
            res.status(404)
                .json({
                    message: "User Not Found",
                    success
                })
        }


        //if user found

        //activityLogger
        await activityLogger(req.user.id, "Fetched User Contribution Info ", "get users/contribution-info/:id", {
            UserId: user.id,
            UserEmail: user.email,
            UserMobile: user.mobile,
        })

        const contribution_info = user.contribution_Info;
        res.status(200)
            .json({
                message: "Fetched User Contribution Info Successfully",
                success: true,
                data:contribution_info
            })
    }
    catch (error) {
        console.error(error)
        res.status(500)
            .json({
                message: "Failed to Fetched User's Contribution Info",
                success: false,
                error
            })
    }
}

const getUserDonations = async (req, res) => {

    try {
        //getting User id
        const { userId } = req.query;

        //getting User

        const user = await UserModel.findById(userId).populate("Donations").exec();

        //if user does not exist
        if (!user) {
            return res.status(404)
                .json({
                    message: "User Not Found",
                    success
                })
        }

        const total = user.Donations.length;

        if (user.Donations.length == 0) {
            return res.status(404)
                .json({
                    message: "No Donations FOUND",
                    success: false,
                    data: null,
                    total
                })
        }
        //if user found

        //activityLogger
        await activityLogger(req.user.id, "Fetched User Donations Info ", "get users/donations/:id", {
            FetchedBy: `${req.user.firstName} ${req.user.lastName}`,
            UserId: user.id,
            UserEmail: user.email,
            UserMobile: user.mobile,
        })

        const donations = user.Donations;
        res.status(200)
            .json({
                message: "Fetched User Donations Info Successfully",
                success: true,
                data: donations,
                total
            })
    }
    catch (error) {
        console.error(error)
        res.status(500)
            .json({
                message: "Failed to Fetched User's Donations Info",
                success: false,
                error
            })
    }
}

const getUserDelivery = async (req, res) => {

    try {
        //getting User id
        const { userId } = req.query;

        //getting User

        const user = await UserModel.findById(userId).populate("assigned_donations").exec();

        //if user does not exist
        if (!user) {
            return res.status(404)
                .json({
                    message: "User Not Found",
                    success
                })
        }

        const total = user.assigned_donations.length;

        if (user.assigned_donations.length == 0) {
            return res.status(404)
                .json({
                    message: "No assigned donations FOUND",
                    success: false,
                    data: null,
                    total
                })
        }
        //if user found

        //activityLogger
        await activityLogger(req.user.id, "Fetched User Delivery Info ", "get users/delivery/:id", {
            FetchedBy: `${req.user.firstName} ${req.user.lastName}`,
            UserId: user.id,
            UserEmail: user.email,
            UserMobile: user.mobile,
        })

        const delivery = user.assigned_donations;
        res.status(200)
            .json({
                message: "Fetched User Donations Info Successfully",
                success: true,
                data: delivery,
                total
            })
    }
    catch (error) {
        console.error(error)
        res.status(500)
            .json({
                message: "Failed to Fetched User's Donations Info",
                success: false,
                error
            })
    }
}

const getUserReports = async (req, res) => {
    try {

        const { userId, status, page = 1, limit = 10, reportType, sort = "createdAt" } = req.query;

        const query = {};
        if (status) query.status = status;
        if (reportType) query.reportType = reportType;

        query.reportedUserId = userId;

        const reports = await ReportModel.find(query)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort(sort);

        const total = await reports.countDocuments(query);


        //checking if reports exist
        if(!reports.length) {
            return res.status(404)
                .json({
                    message: "Reports NOT FOUND",
                    success: false,
                    data: [],
                    total,
                    page,
                    limit
                })
        }

        //if reports exist

        res.status(200)
            .json({
                message: "Fetched Reports Successfully",
                success: true,
                data: reports,
                total,
                page,
                limit
            })

    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Failed to Fetch User Reports",
                success: false,
                data: [],
                total: 0,
                page,
                limit

            })
    }
}

module.exports = {
    getAllUsers,
    getUserByidentifier,
    getUserActivityLogs,
    getUserContributionInfo,
    getUserDonations,
    getUserDelivery,
    getUserReports
}