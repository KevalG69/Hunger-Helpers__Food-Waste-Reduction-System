//External Modules
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cron = require('node-cron');

const http = require("http");
const {Server} = require("socket.io")

//Core Modules

//local Modules
const updateAllLeaderboards = require("./functions&utils/updateLeaderboard.js");
const calculateRegionAnalytics = require('./functions&utils/calculateAnalytics.js');
const calculateDailyDonationData = require('./functions&utils/calculateDailyDonationData.js');

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

//-------------Socket io implementaion for real time notification

//creating HTTP server
const server = http.createServer(app);
// Import and initialize Socket.IO
const { initSocket } = require("./functions&utils/socketHandler.js");
initSocket(server); // Pass the http server to socket module

//----------------
app.use(cors());

//connecting to database
dataBaseConnect();

//--bodyparser

//-----------------Auto Updaters

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('⏳ Running daily leaderboard update...');
    await updateAllLeaderboards();
    await calculateRegionAnalytics();
  await calculateDailyDonationData();
  });

  

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
app.use("/report",ReportRouter);

//--Request Router
app.use("/request",RequestRouter);




//--------------------
const PORT = process.env.PORT;


//listening requests
server.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});

