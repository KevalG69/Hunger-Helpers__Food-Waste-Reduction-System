//modules 
const mongoose = require("mongoose");

//creating schema

// NGO=>NGO'People manager,=>Teachers,volunteers 
// 	Donators=>Restaurant'manager/Restaurant => houseHolds
const userSchema = new mongoose.Schema({
    verified: { type: Boolean, default: false },
    role: {
        type: String, enum: ['Admin', 'Manager', 'Teacher', 'Volunteer', 'Restaurant-Donor', 'HouseHold-Donor'],
        default: 'HouseHold-Donor',
        required: true
    },

    nickName: { type: String ,default:"None"},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number },

    state: { type: String, required: true },
    city: { type: String, required: true },
    locality: { type: String },

    email: { type: String },
    mobile: { type: String },

    profilePhoto: { type: String },
    password: { type: String, required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    avaibility_status: { type: String, enum: ['Available', 'Busy', 'Inactive'], default: "Available" },

    contribution_Info: { type: mongoose.Schema.Types.ObjectId, ref: "Contribution_Info" },
    // donations:[{ type: mongoose.Schema.Types.ObjectId, ref: "Donation_Box"}],
    // assigned_donations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Volunteer_Donations" }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
    helpRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Volunteer_Help" }],
    chatThreads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
    // activity_logs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity_Logs" }],
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],
});

//creating virtual references for DONATIONS
userSchema.virtual("Donations", {
    ref: "Donation_Box",
    localField: "_id",
    foreignField: "user_id"
})

//creating virtual references for assigned_donations
userSchema.virtual("assigned_donations", {
    ref: "Volunteer_Donation_Delivery",
    localField: "_id",
    foreignField: "volunteer_id"
})

userSchema.virtual("activity_logs", {
    ref: "Activity_Log",
    localField: "_id",
    foreignField: "user_id"
})

const User = mongoose.model('User', userSchema);

//creating partial index in mobile field
User.createIndexes({ mobile: 1 }, { unique: true, partialFilterExpression: { mobile: { $exists: true, $ne: null } } })
  .then(() => console.log('Partial index created on mobile field'))
  .catch(err => console.error('Error creating index:', err));


module.exports = User;