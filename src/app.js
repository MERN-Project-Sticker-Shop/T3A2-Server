import express from 'express'
import cors from 'cors'
import productRoutes from './routes/product_routes.js'
import cartRoutes from './routes/cart_routes.js'
import orderRoutes from './routes/order_routes.js'


//Create a new instance of express server
const app = express() 

//Middlewares
app.use(cors())  
app.use(express.json())  

//Routes
app.get('/', (request, response) => response.send({info: 'Sticker Shop API'})) // a route middleware

app.use('/products', productRoutes)
app.use('/carts', cartRoutes)
app.use('/orders', orderRoutes)

export default app