//Module
const mongoose = require("mongoose");

const contributionInfoSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    
    score: { type: Number, default:0},
    badge: { type: String},

    donations_Count: { type: Number, default: 0},
    delivery_Count: { type: Number, default: 0},

    last_contribution:{ type: Date}
})

module.exports = mongoose.model('Contribution_Info',contributionInfoSchema);