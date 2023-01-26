import { ProductModel, CartModel, dbClose } from './db.js'

//Clear database
await ProductModel.deleteMany()
console.log('Deleted all products') 

await CartModel.deleteMany()
console.log('Deleted all cart items')

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

const pros = await ProductModel.insertMany(products)
console.log('Inserted products')

//Seed cart data to the database
const carts = [
  {item: [{product: pros[0].name,
   price: pros[0].price,
   quantity: 1},
   {product: pros[1].name,
    price: pros[1].price,
    quantity:10}
  ]}
]

await CartModel.insertMany(carts)

console.log('Inserted entries')

dbClose()