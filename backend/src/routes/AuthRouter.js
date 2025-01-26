//Modules
const AuthRouter = require("express").Router();

//Middlewares
const {RegisterStep1Validator,RegisterStep2Validator,loginValidator} = require("../middlewares/loginValidator.js")

//Controllers
const {} = require("../controllers/AuthController.js")

//Request

//registration url
AuthRouter.post('/register/step1',RegisterStep1Validator);
AuthRouter.post('/register/step2',RegisterStep2Validator);

//login url
AuthRouter.post('/login',loginValidator);


module.exports = AuthRouter