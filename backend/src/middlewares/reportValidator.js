//Modules
const joi = require("joi");

//Models


//functions

//  reporterId: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
//     reportedUserId: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
//     reportedDonationId: { type: mongoose.Schema.Types.ObjectId, ref:'Donation_Box',required:true},

//     reportType: { type: String, required:true},
//     desription: { type: String, required:true},
//     evidence: [{ type: String}],
//     status: { type: String, enum:['Pending','Reviewed','Resolved'], default:'Pending'},

//     adminAction: { 
//         actionTaken: { type: String, enum:['Warning','Ban','no_action','Resticted','Deleted','Edited'],default:"no_action",required: true},
//         reason: { type: String, required:true},
//         adminId: { type: mongoose.Schema.Types.ObjectId, ref:'User',required: true},
//         timestamp: { type: Date, default: Date.now, required:true}
//     },
//     createdAt: { type: Date, default: Date.now},
//     updatedAt: { type: Date, default: Date.now}
const reportValidator = (req,res,next)=>{

    //creating schema
        const schema = joi.object({
            reportedUserId: joi.required(),
            reportedDonationId: joi.required(),
            reportType: joi.string().min(3).max(50).required(),
            desription: joi.string().min(4).required(),
            evidence: joi.allow(null).optional(),
        })
    
        const { error } = schema.validate(req.body);
    
        if (error) {
            return res.status(404)
                .json({
                    message: "Validation Error at Report Data validator",
                    success: false,
                    error
                })
        }
    
        console.log("report Validation Clear");
        next();

}


module.exports = reportValidator;