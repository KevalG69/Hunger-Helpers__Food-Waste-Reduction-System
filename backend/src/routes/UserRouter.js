//Modules
const UserRouter = require("express").Router();

//Controllers
const {GetAllUsers,GetUserByidentifier} = require("../controllers/GetUsersController.js");
const {UpdateUserProfile, UpdateUserIdentifier,UpdateUserRole} = require("../controllers/UpdateUserController.js");

//Middlewares
const {verifyToken,isAdmin,isManager,isMangerOrSelf} = require("../middlewares/authValidator");

const { canChangeUserRole,canMakeManager } 
        = require("../middlewares/rolePermValidator.js");

const { userBasicDataValidator,userAdvDataValidator} = require("../middlewares/userDataValidator.js");




//-----------------------
//Get All user API - users/
UserRouter.get("/",verifyToken,isAdmin,GetAllUsers);

//Get User By identifier - users/identifier

UserRouter.get("/identifier",verifyToken,isManager,GetUserByidentifier);


//Update User users/identifier
UserRouter.put("/profile",verifyToken,isMangerOrSelf,userBasicDataValidator,UpdateUserProfile);


//Update user Role
UserRouter.put("/role",verifyToken,canChangeUserRole,UpdateUserRole);

UserRouter.put("/role-manager",verifyToken,canMakeManager,UpdateUserRole);


//Update User identifier
UserRouter.put("/identifier",verifyToken,isAdmin,userAdvDataValidator,UpdateUserIdentifier);







module.exports = UserRouter;