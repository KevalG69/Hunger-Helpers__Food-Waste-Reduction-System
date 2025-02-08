//Modules
const UserRouter = require("express").Router();

//Controllers
const {GetAllUsers,GetUserByidentifier} = require("../controllers/GetUsersController.js");
const {UpdateUserProfile} = require("../controllers/UpdateUserController.js");

//Middlewares
const {verifyToken,isAdmin,isManager,isMangerOrSelf} = require("../middlewares/authValidator");

//Get All user API - users/
UserRouter.get("/",verifyToken,isAdmin,GetAllUsers);

//Get User By identifier - users/identifier

UserRouter.get("/identifier",verifyToken,isManager,GetUserByidentifier);


//Update User users/identifier
UserRouter.put("/identifier",verifyToken,isMangerOrSelf,UpdateUserProfile);




module.exports = UserRouter;