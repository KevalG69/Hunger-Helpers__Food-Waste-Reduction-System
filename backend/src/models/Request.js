//Modules

const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    type:{ type: String,required:true},
    requestedFrom:{ type: mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    requestedFrom_firstName:{ type:String,required:true},
    requestedFrom_lastName:{ type:String, required:true},

    requestedTo:{ type: mongoose.Schema.Types.ObjectId,ref:"User", required: true},

    requestedTo_firstName:{ type:String},
    requestedTo_lastName:{ type:String},

    askedTo:{type: String, required:true},
    donationBoxId:{type: mongoose.Schema.Types.ObjectId, ref:"Donation_Box"},
    status:{type: String},
    createdAt: { type: Date, default:Date.now}
})

module.exports = mongoose.model("Request",requestSchema);