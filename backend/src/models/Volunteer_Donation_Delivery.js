//modules
const mongoose = require("mongoose");

const volunteerDDSchema = new mongoose.Schema({
    volunteer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    donation_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Donation_Box',
        required: true
    },
    status: { type: String, enum: ['Accepted', 'PickedUp', 'Deliverd', 'Cancelled'] },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now, required: true }
    ,
})

module.exports = mongoose.model('Volunteer_Donation_Delivery', volunteerDDSchema);