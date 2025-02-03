//modules
const mongoose = require("mongoose");

const donationDataSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    total_meals_served: { type: Number, required: true },
    total_donors: { type: Number, required: true },
    total_volunteers: { type: Number, required: true },
    total_food_wasted: { type: Number, required: true }
})

module.exports = mongoose.model('Donation_Data', donationDataSchema);