//External Modules
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
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


//creating app 
const app = express();
app.use(cors());

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
//--Register/login auth Router

app.use("/auth",AuthRouter);


//--User Router
app.use("/users",UserRouter);


//--Donations Router
app.use("/donation-box",DonationBoxRouter);

//--Volunteer Router
app.use("/volunteers",VolunteerRouter);


//--Request Router
app.use("/request",RequestRouter);




//--------------------
const PORT = process.env.PORT;
//listening requests
app.listen(PORT,()=>{
    console.log(`Server Running on http://localhost:${PORT}`)
})

