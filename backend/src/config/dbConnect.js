//Modules
const mongoose = require("mongoose");

//
const dataBaseConnect=async ()=>{
    try
    {
        const url = process.env.MONGO_CONNECTION_STR;
        const connect = await mongoose.connect(url);
        console.log(`Connetion Successfull : HOST:${connect.connection.host}
             NAME:${connect.connection.name}`)
    }
    catch(error)
    {
        console.log(`Connection Error : ${error}`)
        process.exit(1)
    }
}

module.exports = dataBaseConnect