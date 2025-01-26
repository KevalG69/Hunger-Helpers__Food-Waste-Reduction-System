//module
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    sender_id:{ type: mongoose.Schema.Types.ObjectId, required:true},
    receiver_id:{ type: mongoose.Schema.Types.ObjectId, required:true},
    message:{ type: String, required:true},
    timestamp:{ type: Date, default: Date.now, required:true},
    status:{ 
        type: String,
        enum: ['Sent','inProgress','Deliverd','Seen'],
        default:'Sent'
    }
})