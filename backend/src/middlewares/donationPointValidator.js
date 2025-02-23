//Modules
const joi = require("joi");

//Models


//functions


const donationPointValidator = (req, res, next) => {

    //creating schema
    const schema = joi.object({
        name: joi.string().min(3).max(25).required(),
        description: joi.string().min(5).max(60).required(),
        location: {
            lat: joi.number().required(),
            lng: joi.number().required()
        },
        address: joi.string().min(5).max(60).required(),
        active: joi.boolean().required()
    })

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(404)
            .json({
                message: "Validation Error at Donation Point Data validator",
                success: false,
                error
            })
    }

    console.log("Donation Point Validation Clear");
    next();

}


module.exports = donationPointValidator;