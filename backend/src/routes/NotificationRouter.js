//Modules
const NotificationRouter = require("express").Router();

//Controller
const { getAllUserNotification, markAsRead, deleteNotification } = require("../controllers/NotificationController");

//Middlewares
const { verifyToken, isMangerOrSelf } = require("../middlewares/authValidator");

//function 

//---------------------APIs

//GET /api/notifications/ → Get all notifications for the user
NotificationRouter.get("/",verifyToken,isMangerOrSelf,getAllUserNotification);

//PUT /api/notifications/:id/read → Mark notification as read
NotificationRouter.put("/read",verifyToken,markAsRead);

//DELETE /api/notifications/:id → Delete a notification
NotificationRouter.delete("/",verifyToken,deleteNotification);



module.exports = NotificationRouter;