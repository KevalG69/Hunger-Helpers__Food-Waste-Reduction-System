//module
const jwt = require("jsonwebtoken");

//Models
const UserModel = require("../models/User.js");


//
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const refreshToken = async (req, res) => {

    //getting Token
    const { refreshToken } = req.body;

    //if token does not exist
    if (!refreshToken) {
        return res.status(403)
            .json({
                message: "Refresh Token is Required",
                success: false
            })
    }

    //if refresh token exist
    try//try catch block to handle run time error
    {
        //verify refresh token
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);


        //checking if user Still exist
        const user = await UserModel.findById(decoded._id);

        //if user does not exist
        if (!user) {
            return res.status(404)
                .json({
                    message: "User Not Found",
                    success: false
                })
        }

        //if user exist

        //generation new token for user
        const jwtToken = jwt.sign(
            {
                email: decoded.email,
                _id: decoded._id
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        //sending response
        res.status(200)
            .json({
                message:"New Token Generated",
                success:true,
                token:jwtToken
            })

    }
    catch (error) {
        res.status(403)
            .json({
                message: "Invalid Refresh Token",
                success: false,
                error: error
            })
    }

}

module.exports = refreshToken;