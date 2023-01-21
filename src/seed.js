import { ProductModel, dbClose } from './db.js'

//Clear database
await ProductModel.deleteMany()
console.log('Deleted all products') 

//Seed product data to the database
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