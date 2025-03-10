//modules
const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    type: {
        type: String,
        enum: ['Donation Update', 'Reminder', 'Achievement', 'Message', 'Reports', 'Profile Update','Request Update'],
        required: true
    },
    message: { type: String, required: true },

    read_status: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Notification', notificationsSchema)