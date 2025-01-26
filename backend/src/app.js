//External Modules
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv").config();

//Core Modules

//local Modules

//-from config
const dataBaseConnect = require("./config/dbConnect.js")

//-from routes

//creating app 
const app = express();
app.use(cors());

//connecting to database
dataBaseConnect();

//requests
app.use("/",(req,res,next)=>{
    console.log(`Request Url = "${req.url}",Request Method = "${req.method}",Request body = "${req.body}"`)
})

const PORT = process.env.PORT;
//listening requests
app.listen(PORT,()=>{
    console.log(`Server Running on http://localhost:${PORT}`)
})

