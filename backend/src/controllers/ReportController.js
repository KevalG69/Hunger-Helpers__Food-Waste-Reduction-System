//Models 
const ReportModel = require("../models/Report.js");
const UserModel = require("../models/User.js");
const DonationBoxModel = require("../models/Donation_Box.js");

//Funciton
const activityLogger = require("../functions&utils/activityLogger.js");


const createReport = async (req, res) => {
    try {
        //extracting data 
        const { reportedUserId,
            reportedDonationId,
            reportType,
            description,
            evidence
        } = req.body;

        console.log(req.body)
        if (!reportedDonationId) {
            return res.status(404)
                .json({
                    message:"Donation Box ID Not Found",
                    success:false,
                    data:null
                })
        }
        else {
            //finding donatoin box
            const donation_box = await DonationBoxModel.findById(reportedDonationId);

            //if donation box does not exist
            if (!donation_box) {
                return res.status(404)
                    .json({
                        message: "Donation Box NOT FOUND",
                        success: false,
                        data: null
                    })
            }
        }


        //finding report
        const report = await ReportModel.findOne({
            reporterId: req.user.id,
            reportedUserId: reportedUserId,
            reportedDonationId: reportedDonationId,
            reportType: reportType
        })

        //checking if report already exist
        if (report) {
            return res.status(403)
                .json({
                    message: "User Already Reported",
                    success: false,
                    data: null,
                })
        }

        //if report does not exist create one
        const reportModel = new ReportModel({
            reporterId: req.user.id,
            reportedUserId: reportedUserId,
            reportedDonationId: reportedDonationId,
            reportType: reportType,
            description: description,
            evidence: evidence,
        })

        //saving report
        const sReport = await reportModel.save();

        await UserModel.findByIdAndUpdate(reportedUserId, {
            $push: { reports: sReport.id }
        })

        await DonationBoxModel.findByIdAndUpdate(reportedDonationId, {
            $push: { reports: sReport.id }
        })


        //activityLogger
        await activityLogger(req.user.id, "Submited Report", "post /report", {
            reportId: sReport.id,
            reporterName: `${req.user.firstName} ${req.user.lastName}`,
            reportedUserId: reportedUserId,
            reportedUserName: `${req.user.firstName} ${req.user.lastName}`,
            reporteType: reportType,

            DonationBoxId: reportedDonationId
        })

        res.status(200)
            .json({
                message: "Report Submited Successfully",
                success: true,
                data: sReport,
            })

    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Failed to Submit Report",
                success: false,
                data: null,
                error
            })
    }

}

const getAllReport = async (req, res) => {
    try {
        //extracting Data
        //query
        const { status, page = 1, limit = 10, reportType, sort = "createdAt" } = req.query;

        const query = {};
        if (status) query.status = status;
        if (reportType) query.reportType = reportType;


        const reports = await ReportModel.find(query)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort(sort);

        const total = await reports.countDocuments(query);

        //checking if reports exist
        if (!reports.length) {
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
                message: "Failed to Fetch Reports",
                success: false,
                data: [],
                total: 0,
                page,
                limit,
                error
            })
    }
}

const updateReportStatus = async (req, res) => {
    try {
        //extracting Data
        const { reportId } = req.query;
        const { status, action, reason } = req.body;
        //finding report
        const report = await ReportModel.findById(reportId);

        //checking if report available
        if (!report) {
            return res.status(404)
                .json({
                    message: "Report NOT FOUND",
                    success: false,
                    data: null
                })
        }

        //if report exist 
        report.status = status;
        report.adminAction.actionTaken = action;
        report.adminAction.reason = reason;
        report.adminAction.adminId = req.use.id;

        report.updatedAt = Date.now();
        await report.save();



        //activityLogger
        await activityLogger(req.user.id, "Updated Report", "put /report", {
            reportId: report.id,
            updaterName: `${req.user.firstName} ${req.user.lastName}`,
            updatedStatus: status,
            ActionTaken: action,
            ReasonUpdate: reason,
            reporteType: reportType,
            DonationBoxId: report.reportedDonationId
        })

        res.status(200)
            .json({
                message: "Updated Report Successfully",
                success: true,
                data: report
            })
    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Failed to update Report",
                success: false,
                data: null,
                error
            })
    }
}

module.exports = {
    createReport,
    getAllReport,
    updateReportStatus
}