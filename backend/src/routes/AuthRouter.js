//Modules
const AuthRouter = require("express").Router();

//Middlewares
const {RegisterStep1Validator,RegisterStep2Validator,loginValidator} = require("../middlewares/loginValidator.js")

//Controllers
const {register,login, codeVerification, sendVerificationCode} = require("../controllers/AuthController.js")
const {forgotPassword,resetPassword} = require("../controllers/RecoverPassController.js");
const refreshToken = require("../controllers/RefreshTokenController.js");


//Request

//registration api

//step 1
AuthRouter.post('/register-step1',RegisterStep1Validator,sendVerificationCode);

//resend code
AuthRouter.post('/register-resend-code',sendVerificationCode);
//code verification
AuthRouter.post('/register-verify',codeVerification);

//step 2
AuthRouter.post('/register-step2',RegisterStep2Validator);

//final register
AuthRouter.post('/register',register);


//login api
AuthRouter.post('/login',loginValidator,login);


//forgot password
AuthRouter.post('/forgot-password',forgotPassword);
//reset password
AuthRouter.post('/reset-password',resetPassword);

//refresh Token
AuthRouter.post('/refresh-token',refreshToken);

module.exports = AuthRouter