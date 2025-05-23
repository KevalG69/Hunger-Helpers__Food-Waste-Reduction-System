//module
const mongoose = require("mongoose");

const reportsSchema = new mongoose.Schema({
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    reportedUserId: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    reportedDonationId: { type: mongoose.Schema.Types.ObjectId, ref:'Donation_Box'},

    reportType: { type: String, required:true},
    description: { type: String, required:true},
    evidence: [{ type: String}],
    status: { type: String, enum:['Pending','Reviewed','Resolved'], default:'Pending'},

    adminAction: { 
        actionTaken: { type: String, enum:['Warning','Ban','no_action','Resticted','Deleted','Edited'],default:"no_action",required: true},
        reason: { type: String},
        adminId: { type: mongoose.Schema.Types.ObjectId, ref:'User'},
        timestamp: { type: Date, default: Date.now}
    },
    createdAt: { type: Date, default: Date.now},
    updatedAt: { type: Date, default: Date.now}
})

module.exports = mongoose.model("Reports",reportsSchema);