import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Read .env file
dotenv.config()  

async function databaseConnector(databaseURL){
    await mongoose.connect(databaseURL);
}

async function databaseDisconnector(){
    await mongoose.connection.close();
}

export { databaseConnector, databaseDisconnector}