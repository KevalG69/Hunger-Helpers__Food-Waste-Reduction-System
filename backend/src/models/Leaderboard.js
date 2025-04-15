//modules
const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
    date: { type: Date, required:true},
    ranking_type: { type: String, enum:['Top-Donors','Top-Volunteers','Top-Managers'],
        required:true
    },
    rankings:[{
        user_id: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
        rank: { type: Number, required:true},

        name: { type: String, required:true},
        profilePhoto: { type: String},
        contribution_points: { type: Number,  default: 0 },
        donation_count: { type: Number,  default: 0 },
        deliveries_completed: { type: Number,  default: 0 },
        badges: [{ type: String}]
    }],
    createdAt: { type: Date, default: Date.now},
    updatedAt: { type: Date, default: Date.now}
})

module.exports = mongoose.model("Leaderboard",leaderboardSchema);