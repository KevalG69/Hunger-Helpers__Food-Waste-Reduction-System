//module
const mongoose = require("mongoose");

const activityLogsSchema = new mongoose.Schema({
    user_id:{ type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},

    activity_type:{ type: String, required:true},
    timestamp:{ type: Date, default: Date.now},
    metadata:{ type: Object}
})

module.exports = mongoose.model('Activity_Log',activityLogsSchema);