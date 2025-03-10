//External Modules
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");

const http = require("express");
const {Server} = require("socket.io")
//Core Modules

//local Modules

//-from config
const dataBaseConnect = require("./config/dbConnect.js")

//-from routes
const AuthRouter = require("./routes/AuthRouter.js");
const UserRouter = require("./routes/UserRouter.js");
const DonationBoxRouter = require("./routes/DonationBoxRouter.js");
const RequestRouter = require("./routes/RequestRouter.js");
const VolunteerRouter = require("./routes/VolunteerRouter.js");
const DonationPointRouter = require("./routes/DonationPointRouter.js");
const VolunteerHelpRouter = require("./routes/VolunteerHelpRouter.js");
const NotificationRouter = require("./routes/NotificationRouter.js");
const AnalyticsRouter = require("./routes/AnalyticRouter.js");
const LeaderboardRouter = require("./routes/LeaderboardRouter.js");
const ReportRouter = require("./routes/ReportRouter.js");

//creating app 
const app = express();
app.use(cors());

//-------------Socket io implementaion for real time notification

//creating HTTP server
const server = http.createServer(app);

//intializing socket.io
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5332",
        methods:["GET","POST"]
    },
    connectionTimeout: 10000, // Timeout after 10 seconds
    reconnection: true, // Enable reconnection
    reconnectionAttempts: 5, // Max reconnection attempts
    reconnectionDelay: 1000, // Delay between reconnection attempts
});

//handle Socket.io connection
io.on("connection",(socket)=>{

    //sending connection message
    console.log(`User connecte : ${socket.id}`);

    //on user join room or creating group 
    socket.on("joinRoom",(userId)=>{
        socket.join(userId)//join room named after the user id
        console.log(`User ${userId} joined room ${userId}`);
    });

    //join donor room
    socket.on("joinDonorRoom",(userId)=>{
        socket.join("donor");
        console.log(`User ${socket.id} joined the Donor Room`);
    });

    //join volunteer room
    socket.on("joinVolunteerRoom",(userId)=>{
        socket.join("volunteer");
        console.log(`User ${socket.id} joined volunteer Room`);
    });

    //join manager 
    socket.on("joinManagerRoom",(userId)=>{
        socket.join("manager");
        console.log(`User ${socket.id} joined Manager Room`);
    });

    //join admin
    socket.on("joinAdminRoom",(userId)=>{
        socket.join("admin");
        console.log(`User ${socket.id} joined admin Room`);
    });

    socket.on("notification", (message) => {
        console.log("Received notification:", message);
        // Update state to display the notification
      });

      
    //Leave Room
    socket.on("leaveRoom", (userId) => {
        socket.leave(userId); // Leave the room
        console.log(`User ${userId} left room ${userId}`);
      });

    socket.on("disconnect",()=>{
        console.log(`User disconnected : ${socket.id}`);
    });

})
//----------------

//connecting to database
dataBaseConnect();

//--bodyparser



//requests
app.use("/",(req,res,next)=>{
    console.log(`Request Url = "${req.url}",Request Method = "${req.method}",Request body = `,req.body)
    next();
})

app.use(bodyParser.json());

//Router
//--Register/login auth Router 1 

app.use("/auth",AuthRouter);


//--User Router 2
app.use("/users",UserRouter);


//--Donations Router 3
app.use("/donation-box",DonationBoxRouter);

//--Volunteer Router 4
app.use("/volunteers",VolunteerRouter);

//--Donation Point Router 5
app.use("/donation-point",DonationPointRouter);

//-Help Request Router 6
app.use("/volunteer-help",VolunteerHelpRouter);

//-Notification Request Router 7
app.use("/notification",NotificationRouter);

//-Analytics Request Router 8
app.use("/analytics",AnalyticsRouter);

//-Leaderboard Request Router 9
app.use("/leaderboard",LeaderboardRouter);

//-Report Request Router 10
app.use("/Report",ReportRouter);

//--Request Router
app.use("/request",RequestRouter);




//--------------------
const PORT = process.env.PORT;
//listening requests
app.listen(PORT,()=>{
    console.log(`Server Running on http://localhost:${PORT}`)
})

