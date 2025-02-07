//module
const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next)=>{

    //getting token from user headers
    const token = req.headers("authorization");

    //checking if token exist
    if(!token)
    {
        //if token not exist
        return res.status(401)  
                .json({
                    message:"Unauthorized token required",
                    valid:false
                })
    }

    //if token exist try and catch block to handle run time error
    try
    {
        //comparing JWT_SECRET and token
        //if token in invalid jwt.verfiy throw error
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded);
        req.user = decoded;
        next();
    }
    catch(error)
    {
        //if token is not valid
        res.status(401)
            .json({
                message:"Unauthorized token invalid",
                valid:false
            })
    }
}


module.exports = verifyToken;