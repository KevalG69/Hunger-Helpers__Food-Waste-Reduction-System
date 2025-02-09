//module
const jwt = require("jsonwebtoken");

//models
const UserModel = require("../models/User.js")

const verifyToken = async (req, res, next) => {

    //getting token from user headers
    const token = req.header("Authorization");

    //checking if token exist
    if (!token) {
        //if token not exist
        return res.status(401)
            .json({
                message: "Unauthorized - token required",
                success: false
            })
    }

    //if token exist try and catch block to handle run time error
    try {
        //comparing JWT_SECRET and token
        //if token in invalid jwt.verfiy throw error
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        //checking if user exist        
        req.user = await UserModel.findById(decoded._id);

        //if user does not exist
        if (!req.user) {
            return res.status(401)
                .json({
                    message: "User Does not Exist",
                    success: false
                })
        }

        next();
    }
    catch (error) {
        //if token is not valid
        res.status(401)
            .json({
                message: "Unauthorized - token invalid",
                success: false
            })
    }
}

const isAdmin = (req, res, next) => {

    //checking user is Admin or Not
    if (req.user.role != "Admin") {
        return res.status(403)
            .json({
                message: "Access Denied Admin Only",
                success: false
            })
    }

    //if user is Admin
    next();
}

const isManager = (req, res, next) => {
    //checking user is Admin or Not
    if (req.user.role == "Admin" || req.user.role == "Manager") {
        //if user is Admin
        next();
    }
    else {
        return res.status(403)
            .json({
                message: "Access Denied",
                success: false
            })
    }
}

const isMangerOrSelf = async (req, res, next) => {

    try {
        //getting role and identifier
        const id = req.params.id;

        //Checking role and id
        if(req.user.role=="Manager"||req.user.role=="Admin"|| req.user.id==id)
        {
            return next();
        }

        //Not Manager or self

        res.status(403)
            .json({
                message:"Access Denied",
                success:false
            })
    }
    catch (error) {
        console.log(error)
        res.status(500)
            .json({
                message:"Internal Server Error At is Manger or self",
                success:false,
                error
            })
    }
}

module.exports = {
    verifyToken,
    isAdmin,
    isManager,
    isMangerOrSelf
}