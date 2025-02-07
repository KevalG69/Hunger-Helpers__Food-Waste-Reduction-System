//Modules
const AuthRouter = require("express").Router();

//Middlewares
const {RegisterStep1Validator,RegisterStep2Validator,loginValidator} = require("../middlewares/loginValidator.js")

//Controllers
const {register,login} = require("../controllers/AuthController.js")
const {forgotPassword,resetPassword} = require("../controllers/recoverPassController.js");


//Request

//registration api


AuthRouter.post('/register-step1',RegisterStep1Validator);
AuthRouter.post('/register-step2',RegisterStep2Validator);

AuthRouter.post('/register',register);


//login api
AuthRouter.post('/login',loginValidator,login);


//forgot password
AuthRouter.post('/forgot-password',forgotPassword);
AuthRouter.post('/reset-password',resetPassword);

module.exports = AuthRouter