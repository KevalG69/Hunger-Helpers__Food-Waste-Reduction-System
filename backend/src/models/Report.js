//module
const mongoose = require("mongoose");

const reportsSchema = new mongoose.Schema({
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    reportedUserId: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    reportedDonationId: { type: mongoose.Schema.Types.ObjectId, ref:'Donation_Box',required:true},
    reportType: { type: String, required:true},
    desription: { type: String, required:true},
    evidence: [{ type: String}],
    status: { type: String, enum:['Pending','Reviewed','Resolved']},

    adminAction: { 
        actionTaken: { type: String, enum:['Warning','Ban','no_action','Resticted','Deleted','Edited'],required: true},
        reason: { type: String, required:true},
        adminId: { type: mongoose.Schema.Types.ObjectId, ref:'User',required: true},
        timestamp: { type: Date, default: Date.now, required:true}
    },
    createdAt: { type: Date, default: Date.now},
    updatedAt: { type: Date, default: Date.now}
})

module.exports = mongoose.model("Reports",reportsSchema);