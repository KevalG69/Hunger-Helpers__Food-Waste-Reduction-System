//Modules
const AuthRouter = require("express").Router();

//Middlewares
const {RegisterStep1Validator,RegisterStep2Validator,loginValidator} = require("../middlewares/loginValidator.js")

//Controllers
const {register,login} = require("../controllers/AuthController.js")

//Request

//registration url


AuthRouter.post('/register-step1',RegisterStep1Validator);
AuthRouter.post('/register-step2',RegisterStep2Validator);

AuthRouter.post('/register',register);


//login url
AuthRouter.post('/login',loginValidator,login);


module.exports = AuthRouter