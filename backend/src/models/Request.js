//Modules

const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    type:{ type: String,required:true},
    requesterFrom:{ type: mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    requestedTo:{ type: mongoose.Schema.Types.ObjectId,ref:"User", required: true},
    askedTo:{type: String, required:true},
    confirmed:{type: String},
    createdAt: { type: Date, default:Date.now}
})

module.exports = mongoose.model("Request",requestSchema);