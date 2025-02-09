//Modules
const joi = require("joi");

//Models

//

const userBasicDataValidator = (req,res,next)=>{
 //creating schema
    const schema = joi.object({
        nickName: joi.string(),
        firstName: joi.string().min(3).max(20),
        lastName: joi.string().min(3).max(15),
        state: joi.string(),
        city: joi.string(),
        age: joi.number(),
        locality: joi.string()
    })

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(404)
            .json({
                message: "Validation Error at user basic validator",
                success: false,
                error
            })
    }

    console.log("userData Validation Clear");
    next();
}

const userAdvDataValidator = (req,res,next)=>{
 //creating schema
    const schema = joi.object({
        email: joi.string().email().allow(null).optional(),
        mobile: joi.string().min(10).allow(null).optional(),
    })

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(404)
            .json({
                message: "Validation Error at user Advance Validator",
                success: false,
                error
            })
    }

    console.log("user Advance validator clear")
    next();
}


module.exports = {
    userBasicDataValidator,
    userAdvDataValidator,
}