//Modules
const nodemailer = require("nodemailer");

const twilio = require("twilio")

//Models

const OtpModel = require("../models/Otp.js");



//to send email to user
const sendEmailOtp = async (UserEmail,UserOtp) => {

    //getting info for email

    try//try and catch block to handle run time error
    {

        console.log(process.env.EMAIL, UserEmail, UserOtp)

        //creating Transporter to send email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        //sending email to User
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: UserEmail,
            subject: "Hunger Helper Password Reset",
            html: `  <h2>Hunger Helper Password Reset</h2>
                    <p>Your password reset code is: <strong>${UserOtp}</strong></p>
                    <p>Enter this code to reset your password.</p>`
        })

        //deleting code if already exist
        const optModelExist = await OtpModel.findOne({email:UserEmail})
        
        if(optModelExist)
        {
            await OtpModel.deleteOne({_id:optModelExist._id});
        }

        //saving user otp to database
        const otpModel = new OtpModel({
            email: UserEmail,
            otp: UserOtp,
            expireIn: Date.now() + 5 * 60 * 1000
        })
        await otpModel.save();

        //if email sent Successfully
        return true;
    }
    catch (error) {
        console.error("Error Sending Email = ", error);
        return false;
    }

}

const sendMobileOtp = async (CC,mobile,UserOtp) => {

    //storing details
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;

    const client = new twilio(accountSid, authToken)
    let countryCode = CC

    try//try and catch block to handle run time error
    {
        //creating and sending message
        const message = await client.messages.create({
            body: `Your Password Reset Code is ${UserOtp}`,
            to: `${countryCode}${UserMobile}`,
            from: process.env.TWILIO_NUMBER
        })

        const otpModel = new OtpModel({
            mobile: UserMobile,
            otp: UserOtp,
            expireIn: Date.now() * 5 * 60 * 1000
        })
        await otpModel.save();

        return true;
    }
    catch (error) {
        console.error("Error Sendin Otp = ", error);
        return false;
    }
}


module.exports = {
    sendEmailOtp,
    sendMobileOtp
}