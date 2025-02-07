//Modules
const joi = require("joi");


//Models


const RegisterStep1Validator = (req,res,next)=>{
    //creating schema
    const schema = joi.object({        
        email:joi.string().email().required(),
        mobile:joi.string().min(10).required(),
        password:joi.string().min(8).required()
    })

    //validating information in req.body by storing it in schema and using validate function
    const {error} = schema.validate(req.body);

    //if error exist
    if(error)
    {
        return res.status(404)
                .json({
                    message:"Validation Error at step 1",
                    success:false,
                    error
                })
    }

    //if there is no error than move it to next
    console.log("Step 1 clear")
    next();
}

const RegisterStep2Validator = (req,res,next)=>{
    //creating schema
    const schema = joi.object({        
        firstName:joi.string().min(3).max(20).required(),
        lastName:joi.string().min(3).max(15).required(),
        state:joi.string().required(),
        city:joi.string().required()
    })

    const {error} = schema.validate(req.body);

    if(error)
    {
        return res.status(404)
                .json({
                    message:"Validation Error at step 2",
                    success:false,
                    error
                })
    }
    
    console.log("Step 2 clear")
    next();
}

//login details validators
const loginValidator = (req,res,next)=>{

    const {loginWith} = req.body;
    console.log(loginWith)
    let schema;
    if(loginWith=="Mobile")
    {
        schema = joi.object({
            loginWith:joi.string(),
            identifier:joi.string().min(10).required(),
            password:joi.string().min(8).required()
        });
        console.log("clear")
    }
    else
    {
        schema = joi.object({
            loginWith:joi.string(),
            identifier:joi.string().email().required(),
            password:joi.string().min(8).required()
        });
    }

    const {error} = schema.validate(req.body);

    if(error)
    {
        return res.status(404)
                .json({
                    message:"Login Validation Error",
                    success:false,
                    error
                })
    }

    next();
}

module.exports = {
    RegisterStep1Validator,
    RegisterStep2Validator,
    loginValidator
}

