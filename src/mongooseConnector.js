import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Read .env file
dotenv.config()  

// Connect to database
async function databaseConnector(databaseURL){
    await mongoose.connect(databaseURL);
}

// Disconnect from database
async function databaseDisconnector(){
    await mongoose.connection.close();
}

export { databaseConnector, databaseDisconnector}