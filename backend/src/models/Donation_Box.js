//module
const mongoose = require("mongoose");


const donationBoxSchema = new mongoose.Schema({
    user_id:{ type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    volunteer_id:{ type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},

    status:{ type: String, enum:['Pending','Completed','Accepted','Cancelled','Expired'], required:true},

    food_image:{ type: String},
    food_name:{ type: String, required: true},
    food_type:{ type: String, enum: ['Veg','Non-Veg'], required:true},
    food_quantity:{ type: String, required:true},
    food_cookedAt:{ type: Date, required:true},
    food_expireAt:{ type: Date, required:true},

    pickup_location:{ type: String, required:true},
    location:{
      lat: { type: Number, required:true},
      lng: { type: Number, required:true}
    },
    pickup_time:{ type: Date,required:true},
    createdAt:{ type: Date, Default: Date.now},
    updatedAt:{ type: Date, Default: Date.now}
})

module.exports = mongoose.model("Donation_Box",donationBoxSchema);