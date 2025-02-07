//Modules
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email:{ type: String},
    mobile:{ type: String},
    otp:{ type: Number, required: true},
    expireIn: { type: Number, required: true}
})

module.exports = mongoose.model("Otp",otpSchema);