//Modules
const UserRouter = require("express").Router();

//Controllers
const {GetAllUsers,GetUserByidentifier,GetUserActivityLogs, GetUserContributionInfo,GetUserDonations} 
                = require("../controllers/GetUsersController.js");
const {UpdateUserProfile, UpdateUserIdentifier,UpdateUserRole, deleteUser} 
        = require("../controllers/UserController.js");

//Middlewares
const {verifyToken,isAdmin,isManager,isMangerOrSelf} = require("../middlewares/authValidator");

const { canChangeUserRole,canMakeManager, canManageUsers, canMonitorSystem } 
        = require("../middlewares/rolePermValidator.js");

const { userBasicDataValidator,userAdvDataValidator} = require("../middlewares/userDataValidator.js");




//-----------------------
//Get All user API - users/
UserRouter.get("/",verifyToken,isAdmin,GetAllUsers);

//Get User By identifier - users/identifier
UserRouter.get("/identifier",verifyToken,isManager,GetUserByidentifier);

//Get User Activity logs
UserRouter.get("/activity-logs",verifyToken,canMonitorSystem,GetUserActivityLogs);

//Get User Contribution Info
UserRouter.get("/contribution-info/",verifyToken,isMangerOrSelf,GetUserContributionInfo);

//Get User Donations
UserRouter.get("/Donations",verifyToken,isMangerOrSelf,GetUserDonations)

//Update User users/identifier
UserRouter.put("/profile",verifyToken,isMangerOrSelf,userBasicDataValidator,UpdateUserProfile);


//Update user Role
UserRouter.put("/role",verifyToken,canChangeUserRole,UpdateUserRole);

UserRouter.put("/role-manager",verifyToken,canMakeManager,UpdateUserRole);


//Update User identifier
UserRouter.put("/identifier",verifyToken,isAdmin,userAdvDataValidator,UpdateUserIdentifier);


//Delete user Account
UserRouter.delete("/",verifyToken,canManageUsers,deleteUser)


module.exports = UserRouter;