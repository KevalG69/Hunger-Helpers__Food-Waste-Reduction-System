//module
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//model 
const UserModel = require("../models/User.js");
const OtpModel = require("../models/Otp.js");

//middlewares
const {sendEmailOtp,sendMobileOtp} = require("../middlewares/sendOtp.js");
const activityLogger = require("../functions&utils/activityLogger.js");

const register = async (req, res) => {

    //try and catch block if there is any error on run time
    try {
        //getting data from req.body
        const { nickName, firstName, lastName, state, city, role,identifier,password } = req.body;
        console.log(req.body);

        //checking if there is user already exist
        const userExist = await UserModel.findOne({
            $or:[{email:identifier},{mobile:identifier}]
        });

        //if there is user already exist
        if (userExist) {
            return res.status(404)
                .json({
                    message: "User Already Exist",
                    success: false
                })
        }

        // if user not exist than creating one

        let email;
        let mobile;
        if(identifier.includes("@"))
        {
            email=identifier;

        }
        else
        {
            mobile=identifier;
        }
        // 1.create user using user model
        const userModel = new UserModel({
            nickName,
            firstName,
            lastName,
            state,
            city,
            role,
            email,
            mobile,
            password
        })

        //2. bcrypting password to store in database

        userModel.password = await bcrypt.hash(password, 10);

        //3. Saving User in database
        await userModel.save();


        //4. sending response of success registretion

        //activityLogger
            await activityLogger(userModel.id,"User Registered","auth/register",{
                email:userModel.email,
                mobile:userModel.mobile
            })

        res.status(200)
            .json({
                message: "User Registered Successfully",
                success: true
            })
    }
    catch (error) {
        //if try block throw any error
        res.status(500)
            .json({
                message: " Registretion - Internal Server Error",
                success: false,
                error
            })
        console.error(error);

    }
}

const sendVerificationCode = async (req, res) => {

    try
    {
        const {registerWith,identifier,CC} = req.body;
        
        //sending verification code
        const otp = Math.floor(100000 + Math.random() * 900000);//generating otp

        let successSentOtp = false;

        //checking login method for otp
        if (registerWith == "Mobile") {
            successSentOtp = await sendMobileOtp(CC, identifier, otp);
        }
        else {
            successSentOtp = await sendEmailOtp(identifier, otp);
        }

        if (!successSentOtp) {
            return res.status(500)
                .json({
                    message: "Error While Sending Code",
                    success: false
                })
        }
        console.warn("Sent")
        //if code sent Successfully
        res.status(200)
            .json({
                message:"verification code Sent Successfully",
                success:true
            })
    }
    catch(error)
    {
        res.status(500)
            .json({
                message:"Internal Server Error At Sending verification code",
                success:false,
                error:error
            })
    }

}

//verification of user email/mobile
const codeVerification = async (req,res)=>
{
    
     try//try and catch block to handle run time error
        {
            //extracting data from request body
            const { identifier, EnteredOtp} = req.body;
    
            //checking if code for requested email/mobile exist in Otp table
            const otpModel = await OtpModel.findOne({
                $or: [{ email: identifier }, { mobile: identifier }]
            })
    
            //if no code exist or expired
            if (!otpModel) {
                return res.status(400)
                    .json({
                        message: "Code Does not Exist",
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
            if (EnteredOtp == otpModel.otp) 
            {
                await OtpModel.deleteOne({_id:otpModel._id});
                return res.status(200)
                    .json({
                        message: "Verification Successfull",
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
                    message: "Internal Server Error At Code Verification",
                    success: false,
                    error: error
                })
        }

}

const login = async (req, res) => {
    //try and catch block for run time error
    try {
        //extracting data from req.body
        const {identifier,password} = req.body;

        const errorMessage = "Email/Mobile or Password invalid"

        
        
        //checking if user exist
        const user = await UserModel.findOne({
            $or:[{email:identifier},{mobile:identifier}]
        })

        //if user not exist
        if (!user) {
           
            return res.status(403)
                .json({
                    message: "User Not Exist Please Register first",
                    success: false,
                });
        }

        //if user exist

        const isPasswordSame = await bcrypt.compare(password, user.password);
       
        //if entered password and password in database is not same

        if (!isPasswordSame) {
            return res.status(403)
                .json({
                    message: errorMessage,
                    success: false,
                })
        }

        //generating jwt Token 
        const jwtToken = jwt.sign(
            {
                email: user.email,
                _id: user._id
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        //generation refresh jwt token
        const jwt_refreshToken = jwt.sign(
            {
                email: user.email,
                _id: user._id
            },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        )
        
        //activityLogger
        await activityLogger(user.id,"User Login","auth/login",{
            email:user.email,
            mobile:user.mobile
        })

        res.status(200)
            .json({
                message:"Login Successfull",
                success:true,
                token: jwtToken,
                refreshToken: jwt_refreshToken,
                firstName:user.firstName,
                lastName:user.lastName,
                email:user.email,
                mobile:user.mobile
            })
    }
    catch (error) {
        console.error(error)
        //if any error occure
        res.status(500)
            .json({
                message:"Login - Internal Server Error",
                success:false,
                error:error
            })
    }
}

const logout = async (req,res)=>{

    try
    {
        const {id} = req.query;
        const user = await UserModel.findById(id)
        //activityLogger
        await activityLogger(user.id,"User Logout","auth/logout",{
            email:user.email,
            mobile:user.mobile
        })
        res.status(200)
            .json({
                message:"Logout Successfull",
                success:true
            })
    }
    catch(error)
    {
        res.status(500)
            .json({
                message:"Internal Server Error At Logout",
                success:false,
                error:error
            })
    }
}
module.exports = {
    register,
    login,
    logout,
    sendVerificationCode,
    codeVerification
}