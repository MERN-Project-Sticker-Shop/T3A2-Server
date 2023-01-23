import express from 'express'
import cors from 'cors'
import productRoutes from './routes/product_routes.js'


//Create a new instance of express server
const app = express() 

//Middlewares
app.use(cors())  
app.use(express.json())  

//Routes
app.get('/', (request, response) => response.send({info: 'Sticker Shop API'})) // a route middleware

app.use('/products', productRoutes)

export default app