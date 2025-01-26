//Modules
const mongoose = require("mongoose");
const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, '../../.env') });

//
const dataBaseConnect=async ()=>{
    try
    {
        const url = process.env.MONGO_CONNECTION_STR;
        console.log("url",url)
        const connect = await mongoose.connect(url)
        
        console.log(`Connetion Successfull : HOST:${connect.connection.host} NAME:${connect.connection.name}`)
    }
    catch(error)
    {
        console.log(`Connection Error : ${error}`)
        process.exit(1)
    }
}

module.exports = dataBaseConnect