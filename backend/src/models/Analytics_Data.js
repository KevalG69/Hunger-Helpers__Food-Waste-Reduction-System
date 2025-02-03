//modules
const mongoose = require("mongoose");

const analytictDataSchema = new mongoose.Schema({
    date: { type: Date, required:true},
    region: { type: String, unique:true, required:true },
    total_meals_donated: { type: Number,  default: 0 },
    total_food_wasted: { type: Number,  default: 0 },
    total_donors: { type: Number,  default: 0 },
    total_volunteers: { type: Number,  default: 0 },
    total_ngos: { type: Number,  default: 0 },
    active_users: { type: Number,  default: 0 },
    donation_success_rate: { type: Number,  default: 0 },
    avg_donation_time: { type: Number,  default: 0 },
    
    top_donors: { type: mongoose.Schema.Types.ObjectId, ref:"User"},
    top_volunteers: { type: mongoose.Schema.Types.ObjectId, ref:"User"},
    
    createdAt: { type: Date, defalut: Date.now, required:true},
    updatedAt: { type: Date, defalut: Date.now, required:true}
})

module.exports = mongoose.model('Analytics_Data',analytictDataSchema);