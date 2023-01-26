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
  name: { type:String, required:true},
  price: { type:Number, required:true},
  description: { type:String, required:true}
})

// Create a shema and model for cart
const cartSchema = await mongoose.Schema(
  {item: [{product: { type:String, required:true },
  price: { type:Number, required:true },
  quantity: { type:Number, required:true }
  }]}
)

// Create a schema and model for order
const orderSchema = await mongoose.Schema({
  content: { type:mongoose.ObjectId, ref: 'Cart'},
  subtotal: { type:Number, required:true }
})


const CartModel = mongoose.model('Cart', cartSchema)
const ProductModel = mongoose.model('Product', productSchema)
const OrderModel = mongoose.model('Order', orderSchema)

export { ProductModel, CartModel, OrderModel, dbClose }