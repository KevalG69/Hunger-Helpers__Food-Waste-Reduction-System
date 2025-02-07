//Modules
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const twilio = require("twilio")

//Models
const UserModel = require("../models/User.js");
const OtpModel = require("../models/Otp.js");

//middlewares
const {sendEmailOtp,sendMobileOtp} = require("../middlewares/sendOtp.js");


// forgot - password api
const forgotPassword = async (req, res) => {

    try {
        //getting indenitfier (email/mobile)
        const { identifier,CC} = req.body;

        //checking user Exist in database
        const user = await UserModel.findOne({
            $or: [{ email: identifier }, { mobile: identifier }]
        })

        //if user not Exist
        if (!user) {
            return res.status(404)
                .json({
                    message: "User Does Not Exist",
                    success: false
                })
        }

        //if user exist

        const otp = Math.floor(100000 + Math.random() * 900000);//generating otp
        let sentSuccess = false

        //if password recovery through email
        if (identifier.includes("@")) {
            //sending code to email 
            sentSuccess = await sendEmailOtp(user.email, otp);
            console.warn(sentSuccess, user.email, otp)
        }
        else//if password recovery through mobile
        {
            //sending otp to mobile
            sentSuccess = await sendMobileOtp(CC,user.mobile, otp);
        }


        if (!sentSuccess) {
            console.log("run")
            return res.status(500)
                .json({
                    message: "Error Sending Otp - Forgot Password",
                    success: false,
                    error: error
                })
        }

        // if recovery code send Successfully
        res.status(200)
            .json({
                message: "Recovery Code Sent Successfully",
                success: true
            })
    }
    catch (error)//if any error is throwed by try block
    {
        res.status(500)
            .json({
                message: "Internal Server Error - Forgot Password",
                success: false,
                error: error
            })
    }
}

const resetPassword = async (req, res) => {

    try//try and catch block to handle run time error
    {
        //extracting data from request body
        const { identifier, EnteredOtp, newPassword } = req.body;

        //checking if code for requested email/mobile exist in Otp table
        const otpModel = await OtpModel.findOne({
            $or: [{ email: identifier }, { mobile: identifier }]
        })

        //if no code exist or expired
        if (!otpModel) {
            return res.status(400)
                .json({
                    message: "Code Does not Exist for User",
                    success: false
                })
        }

        //if code has expired
        const currentTime = Date.now();

        if (currentTime > otpModel.expireIn) {
            //deleting code if it is expired
            await OtpModel.deleteOne({ _id: otpModel._id })

            //sending error
            return res.status(400)
                .json({
                    message: "Code Has Expired",
                    success: false
                })
        }

        //if code does not expired check is it same as in database
        if (EnteredOtp == otpModel.otp) {
            //1.hashing passsword
            const hasedPassword = await bcrypt.hash(newPassword, 10);

            //2.updating password of user in database
            if(identifier.includes("@"))
            {
                await UserModel.updateOne({ email: identifier }, { password: hasedPassword });
            }
            else
            {
                await UserModel.updateOne({mobile:identifier},{password:hasedPassword})
            }

            //3.deleting Code
            await OtpModel.deleteOne({_id:otpModel._id});


            return res.status(200)
                .json({
                    message: "Password Reset Successfull",
                    success: true
                })
        }
        else //if code does not match
        {
            return res.status(404)
                .json({
                    message: "Invalid Code",
                    success: false
                })
        }
    }
    catch (error) {
        res.status(500)
            .json({
                message: "Internal Server Error At Reset Password",
                success: false,
                error: error
            })
    }
}


module.exports = {
    forgotPassword,
    resetPassword
}

