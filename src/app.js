import express from 'express'
import cors from 'cors'
import { ProductModel, dbClose } from './db.js'

//Create a new instance of express server
const app = express() 

//Middlewares
app.use(cors())  
app.use(express.json())  

const products = [
  {name: 'R U OK',
   price: 10,
   description: 'This is a sticker flakes'
  },
  {name: 'Summer Vibe',
  price: 15,
  description: 'This is a summary sticker sheet'
 }
]

await ProductModel.insertMany(products)
console.log('Inserted products')

dbClose()

export default app