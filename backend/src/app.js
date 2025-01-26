//External Modules
const express = require("express")
const cors = require("cors")
require("dotenv").config();

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


//listening requests
app.listen(PORT,()=>{
    console.log(`Server Running on http://localhost:${PORT}`)
})

