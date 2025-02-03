//module
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    thread_id: { type: String, required: true },
    sender_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['Sent', 'inProgress', 'Deliverd', 'Seen'],
        default: 'inProgress'
    }
})