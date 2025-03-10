//modules
const mongoose = require("mongoose");

const DonatonPointSchema = new mongoose.Schema({
    manager_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    donations:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Donation_Box'}],
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    address: { type: String, required: true },
    active: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Donation_Point", DonatonPointSchema);