//Modules
const joi = require("joi");

//Models


//functions


const donationBoxValidator = (req,res,next)=>{

    //creating schema
        const schema = joi.object({
            status: joi.string().allow(null).optional(),
            food_image: joi.string().allow(null).optional(),
            food_name: joi.string().min(3).max(50).required(),
            food_type: joi.string().required(),
            food_quantity: joi.string().required(),
            food_cookedAt: joi.date().required(),
            food_expireAt: joi.date().required(),
            pickup_location: joi.string().required(),
            location:{
                lat:joi.number().required(),
                lng:joi.number().required()
            },
            pickup_time: joi.date().required()
        })
    
        const { error } = schema.validate(req.body);
    
        if (error) {
            return res.status(404)
                .json({
                    message: "Validation Error at Donation Box Data validator",
                    success: false,
                    error
                })
        }
    
        console.log("Donation Box Validation Clear");
        next();

}


module.exports = donationBoxValidator;