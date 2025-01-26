//modules 
const mongoose = require("mongoose");

//creating schema

// NGO=>NGO'People manager,=>Teachers,volunteers 
// 	Donators=>Restaurant'manager/Restaurant => houseHolds
const userSchema = new mongoose.Schema({
    verified: { type: String, default:false},
    role:{ type: String, enum:['Admin','manager','Teacher','volunteer','Restaurant-Donor','houseHold-Donor'],
        default:'houseHold-Donor',
        required:true},
        
    nickName:{ type: String, },
    firstName:{ type: String, required:true},
    lastName:{ type: String, required:true},
    age: { type: Number},

    state:{ type: String, required:true},
    city:{ type: String, required:true},
    locality:{ type: String},
    
    email:{ type: String, unique:true , required:true},
    mobile:{ type: String, unique:true, required:true},
    
    profilePhoto:{ type: String},
    password:{ type: String, required:true},
    
    createdAt:{ type: Date, default: Date.now},
    updatedAt:{ type: Date, default: Date.now},
    
    contribution_Info:{ type: mongoose.Schema.Types.ObjectId, ref: "Contribution_Info"},
    donations:[{ type: mongoose.Schema.Types.ObjectId, ref: "Donation_Box"}],
    notifications:[{ type: mongoose.Schema.Types.ObjectId, ref: "Notifications"}]
});

module.exports = mongoose.model('User',userSchema);