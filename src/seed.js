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
   imageLinks: [
    'https://i.postimg.cc/7Cgg0Tjt/RUOK1.jpg',
    'https://i.postimg.cc/9zxyd2N2/RUOK2.jpg',
    'https://i.postimg.cc/PCDZnwff/RUOK3.jpg'
   ]
  },
  {name: 'Autumn Vibes',
  price: 15,
  description: 'This is a autumn sticker sheet',
  imageLinks: [
    'https://i.postimg.cc/dhcPnbLH/1b32342cfbe061ad1733ace2f4ffb48.jpg',
    'https://i.postimg.cc/1njbFTkK/a23c8a65932500cd1e72ff2cfc7b675.jpg',
    'https://i.postimg.cc/8F18gLdL/e93cdad8f30d24fb02712ac59d41028.jpg'
  ]
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
    quantity: 1,
    imageLinks: pros[0].imageLinks[0]
    },
    {
    product: pros[1].name,
    price: pros[1].price,
    quantity:10,
    imageLinks: pros[1].imageLinks[0]
    }
  ]},
  {item: [
    {
    product: pros[1].name,
    price: pros[1].price,
    quantity: 20,
    imageLinks: pros[1].imageLinks[0]
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
    phone: '04000000000',
    streetAddress: '135 Elizabeth Street',
    suburb: 'Melbourne',
    state: 'VIC',
    postcode: 3000
  }, 
  {
    email: '67899@gmail.com',
    firstName: 'Bob',
    lastName: 'Tian',
    phone: '0411111111',
    streetAddress: '188 Swanston Street',
    suburb: 'Melbourne',
    state: 'VIC',
    postcode: 3000
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