//Module
const mongoose = require("mongoose");

const contributionInfoSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, default: 0 },
    badges: [{ type: String }],
    donationPoints: { type: Number, default: 0 },
    volunteer_points: { type: Number, default: 0 },
    donation_Count: { type: Number, default: 0 },
    completed_deliveries: { type: Number, default: 0 },
    last_contribution: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contribution_Info', contributionInfoSchema);