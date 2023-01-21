import express from 'express'
import cors from 'cors'

//Create a new instance of express server
const app = express() 

//Middlewares
app.use(cors())  
app.use(express.json())  

export default app