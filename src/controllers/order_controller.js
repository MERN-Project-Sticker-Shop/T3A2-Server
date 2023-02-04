import { OrderModel, AddressModel, CartModel } from '../db.js'

// Get all orders
async function getAllOrder (req, res) {
  res.send(await OrderModel.find().populate('cart').populate('address'))
}

// Get a single order
async function getSingleOrder (req, res) {
  // Use try/except to catch exceptions if entered invalid order id
  try {
    // Find the order object that matches the order id
    const order = await OrderModel.findOne({_id: req.params.orderid}).populate('cart').populate('address')
    // If found, send the order. Otherwise, return the error message
    if (order) {
      res.send(order)
    } else {
      res.status(404).send({ error: 'Order not found!' })
    }}
  catch (err) {
    res.status(500).send({ error: 'Invalid Order Id' })
  }
}

// Create a new address in the database
async function createAddress(req, res) {
  // Use try/except to catch exceptions
  try {
    // Deconstruct the request body
    const { email, firstName, lastName, phone, apartmentOrSuite, streetAddress, suburb, state, postcode } = req.body 
    // Assign parameters to a new variable, which is more secure
    const newAddress = { email, firstName, lastName, phone, apartmentOrSuite, streetAddress, suburb, state, postcode }
    // Create an instance of addess model
    const insertedAddress = await AddressModel.create(newAddress) 
    res.status(201).send(insertedAddress)
  }
  catch(err) {
    res.status(500).send({ error: err.message })
  }
}

// Create a new order in the database
async function createOrder(req, res) {
  // Use try/except to catch exceptions if entered invalid cart id and address id
  try {
    // Deconstruct the request body
    const { addressId, total, cartId } = req.body 
    // Verify whether address exists
    const addressObject = await AddressModel.findOne({ _id: addressId })
    // If exists, continue to verify whether the cart exitst. Otherwise, return the error message
    if (addressObject) {
      // Verify whether cart exists
      const cartObject = await CartModel.findOne({ _id: cartId })
      // If both of them exit, create an instance of order model. Otherwiser, return the error message
      if (cartObject) {
        // Create an javascript object
        const newOrder = { address: addressObject, total, cart: cartObject }
        // Insert into the database
        const insertedOrder = await OrderModel.create(newOrder)    
        res.status(201).send(insertedOrder)
      } else {
        res.status(404).send({ error: 'Cart not found!' })
      }
    } else {
      res.status(404).send({ error: 'Address not found!' })
    }
  }
  catch(err) {
    res.status(500).send({ error: err.message })
  }
}

export { getAllOrder, getSingleOrder, createAddress, createOrder }