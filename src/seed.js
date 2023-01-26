import { ProductModel, CartModel, OrderModel, dbClose } from './db.js'

// Clear database
await ProductModel.deleteMany()
console.log('Deleted all products') 

await CartModel.deleteMany()
console.log('Deleted all cart items')

await OrderModel.deleteMany()
console.log('Deleted all orders')

// Seed product data to the database
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

// Seed cart data to the database
const carts = [
  {item: [
    {
    product: pros[0].name,
    price: pros[0].price,
    quantity: 1
    },
    {
    product: pros[1].name,
    price: pros[1].price,
    quantity:10
    }
  ]},
  {item: [
    {
    product: pros[1].name,
    price: pros[1].price,
    quantity: 20
    }
  ]}
]

const cars = await CartModel.insertMany(carts)
console.log('Inserted cart items')

// Seed order data to the database
const orders = [
  {cart: cars[0], total: 160},
  {cart: cars[1], total: 300}
]

await OrderModel.insertMany(orders)
console.log('Inserted orders')


dbClose()