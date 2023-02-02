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
   price: 3,
   description: 'Perfect for Laptop, ipad, Phone, Bullet Journal, Scrapbook, any smooth and flat surface, ' +
   'The size of the sticker flake is approximately 5.5cm x 6cm (2.17 inches x 2.36 inches), and the material ' +
   'is glossy water resistant laminate. To increase the lifespan of our stickers, ' +
   'please do not submerge it in water for long periods of time or subject it to hard scrubbing.',
   imageLinks: [
    'https://i.postimg.cc/Sxyck0pm/84c3983c010dcf1eb814972e8c66111.jpg',
    'https://i.postimg.cc/905qkKp5/9293fa5769cc68a8e7ff56d8d98ad85.jpg',
    'https://i.postimg.cc/MTjQdq1m/d96034d3160d6b8e7e577f30dfca81c.jpg'
   ]
  },
  {name: 'Autumn Vibes',
  price: 6,
  description: 'Cute Cat Sticker Sheet. Perfect for Journaling, Planners, Card Making, decoration and Scrapbooks! ' +
  'The size of the sticker sheet is approximately 11.5cm x 16.5cm (4.56 inches x 6.49 inches), and ' +
  'it is printed on glossy white sticker paper.  Stickers sheets are NOT waterproof.',
  imageLinks: [
    'https://i.postimg.cc/y6DHpWgH/2938e70e8f884ee20aa9864fba6512a.jpg',
    'https://i.postimg.cc/Pf0kghY8/a9631135138ebca99bef8ade1982662.jpg',
    'https://i.postimg.cc/Qd3ZMb68/e7619087dd1949e6e2f398bb861bfe8.jpg'
  ]
 }
]

const pros = await ProductModel.insertMany(products)
console.log('Inserted products')

// Seed cart data to the database
const carts = [
  {items: [
    {
    product: pros[0].name,
    price: pros[0].price,
    quantity: 1,
    imageLink: pros[0].imageLinks[0]
    },
    {
    product: pros[1].name,
    price: pros[1].price,
    quantity:10,
    imageLink: pros[1].imageLinks[0]
    }
  ]},
  {items: [
    {
    product: pros[1].name,
    price: pros[1].price,
    quantity: 20,
    imageLink: pros[1].imageLinks[0]
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