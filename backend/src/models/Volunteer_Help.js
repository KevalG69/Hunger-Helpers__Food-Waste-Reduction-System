//modules
const mongoose = require('mongoose');

const volunteerHelpSchema = new mongoose.Schema({
    volunteer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    donation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation_Box', required: true },

    status: { type: String, enum: ['Open', 'InProgress', 'Resolved', 'Cancelled'],default:"Open", required: true },
    description: { type: String, required: true },

    createdAt: { type: Date, default: Date.now, required: true },
    resolvedAt: { type: Date },
    
    assistingVolunteers: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Volunteer_Help", volunteerHelpSchema);