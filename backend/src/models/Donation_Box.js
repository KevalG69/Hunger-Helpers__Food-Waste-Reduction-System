//module
const mongoose = require("mongoose");


const donationBoxSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  volunteer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assistingVolunteer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  ngo_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  donation_point_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation_Point' },

  status: { type: String, enum: ['Pending', 'Completed', 'Accepted', 'Cancelled', 'Expired', 'Claimed', 'Delivered'], default:"Pending",required: true },

  food_image: { type: String },
  food_name: { type: String, required: true },
  food_type: { type: String, enum: ['Veg', 'Non-Veg'], required: true },
  food_quantity: { type: String, required: true },
  food_cookedAt: { type: Date, required: true },
  food_expireAt: { type: Date, required: true },

  pickup_location: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  pickup_time: { type: Date },
  delivery_time: { type: Date },
  createdAt: { type: Date, Default: Date.now },
  updatedAt: { type: Date, Default: Date.now },
  helpRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Volunteer_Help" }],
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reports" }]

})

module.exports = mongoose.model("Donation_Box", donationBoxSchema);