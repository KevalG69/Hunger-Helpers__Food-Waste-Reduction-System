//Modules
const UserRouter = require("express").Router();

//Controllers
const {getAllUsers,getUserByidentifier,getUserActivityLogs, getUserContributionInfo,getUserDonations, 
        getUserDelivery, getUserReports} 
                = require("../controllers/GetUsersController.js");
const {updateUserProfile, updateUserIdentifier,updateUserRole, deleteUser,uploadUserProfilePhoto} 
        = require("../controllers/UserController.js");

//Middlewares
const {verifyToken,isAdmin,isManager,isMangerOrSelf, isSelf} = require("../middlewares/authValidator");

const { canChangeUserRole,canMakeManager, canManageUsers, canMonitorSystem } 
        = require("../middlewares/rolePermValidator.js");

const { userBasicDataValidator,userAdvDataValidator} = require("../middlewares/userDataValidator.js");

//Funcitons
const upload = require("../functions&utils/uploadImage.js");

//-----------------------
// - Get All user API - users/
UserRouter.get("/",verifyToken,isAdmin,getAllUsers);

// - Get User By identifier - users/identifier
UserRouter.get("/identifier",verifyToken,isManager,getUserByidentifier);

// - Get User Activity logs
UserRouter.get("/activity-logs",verifyToken,canMonitorSystem,getUserActivityLogs);

// - Get User Contribution Info
UserRouter.get("/contribution-info/",verifyToken,isMangerOrSelf,getUserContributionInfo);

// - Get User Donations
UserRouter.get("/donations",verifyToken,isMangerOrSelf,getUserDonations)

// - Get User Donations
UserRouter.get("/deliveries",verifyToken,isMangerOrSelf,getUserDelivery)

//- GET User Reports
UserRouter.get("/reports",verifyToken,isManager,getUserReports);

//-Update User Profile-Photo
UserRouter.post("/upload-profile-photo",verifyToken,isSelf,upload.single("profilePhoto"),uploadUserProfilePhoto)

// - Update User users/identifier
UserRouter.put("/profile",verifyToken,isMangerOrSelf,userBasicDataValidator,updateUserProfile);

// - Update user Role
UserRouter.put("/role",verifyToken,canChangeUserRole,updateUserRole);

UserRouter.put("/role-manager",verifyToken,canMakeManager,updateUserRole);

// - Update User identifier
UserRouter.put("/identifier",verifyToken,isAdmin,userAdvDataValidator,updateUserIdentifier);


// - Delete user Account
UserRouter.delete("/",verifyToken,canManageUsers,deleteUser)


module.exports = UserRouter;