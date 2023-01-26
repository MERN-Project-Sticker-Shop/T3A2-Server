import { ProductModel, CartModel, OrderModel, AddressModel, dbClose } from './db.js'

// Clear database
await ProductModel.deleteMany()
console.log('Deleted all products') 

await CartModel.deleteMany()
console.log('Deleted all cart items')

await OrderModel.deleteMany()
console.log('Deleted all orders')

await AddressModel.deleteMany()
console.log('Deleted all addresses')

// Seed product data to the database
const products = [
  {name: 'R U OK',
   price: 10,
   description: 'This is a sticker flakes',
   image1: 'https://ibb.co/7vdXTsW',
   image2: 'https://ibb.co/DWTW5tV',
   image3: 'https://ibb.co/XJpPqPT'
  },
  {name: 'Autumn Vibes',
  price: 15,
  description: 'This is a autumn sticker sheet',
  image1: 'https://ibb.co/yNBcb0k',
  image2: 'https://ibb.co/3WS3g9G',
  image3: 'https://ibb.co/ymTVQ9m'
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

// Seed address data to the database
const addresses = [
  {
    email: '12345@gmail.com',
    firstName: 'Alex',
    lastName: 'Yang',
    streetAddress: '135 Elizabeth Street',
    city: 'Melbourne',
    state: 'VIC',
    postcode: 3000,
  }, 
  {
    email: '67899@gmail.com',
    firstName: 'Bob',
    lastName: 'Tian',
    streetAddress: '188 Swanston Street',
    city: 'Melbourne',
    state: 'VIC',
    postcode: 3000,
  }
]

const adds = await AddressModel.insertMany(addresses)
console.log('Inserted addresses')

// Seed order data to the database
const orders = [
  {cart: cars[0], total: 160, address: adds[0]},
  {cart: cars[1], total: 300, address: adds[1]}
]

await OrderModel.insertMany(orders)
console.log('Inserted orders')


dbClose()