import express from 'express'
import cors from 'cors'
import productRoutes from './routes/product_routes.js'
import cartRoutes from './routes/cart_routes.js'
import orderRoutes from './routes/order_routes.js'
import { databaseConnector } from './mongooseConnector.js'


// Create a new instance of express server
const app = express() 

// Middlewares
app.use(cors())  
app.use(express.json())  

// Determine which database to connect with.If under development stage, use test database
// If under production, use production database. To avoid testing mess up the production database
var databaseURL = "";
switch (process.env.NODE_ENV.toLowerCase()) {
    case "development":
        databaseURL = process.env.ATLAS_DB_URL_TEST;
        break;
    case "production":
        databaseURL = process.env.ATLAS_DB_URL;
        break;
    default:
        console.error("server.js will not connect to the database in the current NODE_ENV.");
        break;
}

// Connect to the database
databaseConnector(databaseURL).then(() => {
    console.log("Database connected successfully!");
  }).catch(error => {
    console.log(`
    Some error occurred connecting to the database! It was: 
    ${error}
      `);
})

//Routes
app.get('/', (request, response) => response.send({info: 'Sticker Shop API'})) // a route middleware

app.use('/products', productRoutes)
app.use('/carts', cartRoutes)
app.use('/orders', orderRoutes)


export default app