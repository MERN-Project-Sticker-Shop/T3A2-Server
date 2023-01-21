import mongoose from 'mongoose'
import dotenv from 'dotenv'

//Read .env file
dotenv.config()  

mongoose.set('strictQuery', true)

//Close db connection
async function dbClose() {
  await mongoose.connection.close()
  console.log('Database disconnected')
}

//Connect to the mongo database
try{
  const m = await mongoose.connect(process.env.ATLAS_DB_URL) // obtain the environment variable
  console.log(m.connection.readyState === 1 ? 'Mongoose connected' : 'Mongoose failed to connect')
}
catch(err) {
  console.log(err)
}
