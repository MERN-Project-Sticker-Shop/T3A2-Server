import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Read .env file
dotenv.config()  

mongoose.set('strictQuery', true)

// Close db connection
async function dbClose() {
  await mongoose.connection.close()
  console.log('Database disconnected')
}

// Connect to the mongo database
try{
  const m = await mongoose.connect(process.env.ATLAS_DB_URL) // obtain the environment variable
  console.log(m.connection.readyState === 1 ? 'Mongoose connected' : 'Mongoose failed to connect')
}
catch(err) {
  console.log(err)
}

// Create a schema and model for product
const productSchema = await mongoose.Schema({
  name: { type:String, required:true },
  price: { type:Number, required:true },
  description: { type:String, required:true },
  imageLinks: { type:Array, required:true },
})

// Create a shema and model for cart
const cartSchema = await mongoose.Schema(
  {item: [{product: { type:String, required:true },
  price: { type:Number, required:true },
  quantity: { type:Number, required:true },
  imageLinks: { type:String, required:true }
  }]}
)

// Create a schema and model for order
const orderSchema = await mongoose.Schema({
  cart: { type:mongoose.ObjectId, ref: 'Cart' },
  total: { type:Number, required:true },
  address: { type:mongoose.ObjectId, ref: 'Address' }
})

// Create a schema and model for address
const addressSchema = await mongoose.Schema({
  email: { type:String, required:true},
  firstName: { type:String, required:true},
  lastName: { type:String, required:true},
  phone: { type:String, required:true},
  apartmentOrsuite: { type:String},
  streetAddress: { type:String, required:true},
  suburb: { type:String, required:true},
  state: { type:String, required:true},
  postcode: { type:Number, required:true},
})


const CartModel = mongoose.model('Cart', cartSchema)
const ProductModel = mongoose.model('Product', productSchema)
const OrderModel = mongoose.model('Order', orderSchema)
const AddressModel = mongoose.model('Address', addressSchema)

export { ProductModel, CartModel, OrderModel, AddressModel, dbClose }