import express from 'express'
import { OrderModel, AddressModel, CartModel } from '../db.js'

const router = express.Router()

// Get all orders
router.get('', async (req, res) => {
  res.send(await OrderModel.find().populate('cart').populate('address'))
})

// Get a single order
router.get('/:orderid', async (req, res) => {
  try {
    const order = await OrderModel.findOne({_id: req.params.orderid}).populate('cart').populate('address')
    if (order) {
      res.send(order)
    } else {
      res.status(404).send({ error: 'Order not found' })
    }}
  catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// Create an address
router.post('/address', async (req, res) => {
  try {
    const { email, firstName, lastName, streetAddress, city, state, postcode } = req.body 
 
    const newAddress = { email, firstName, lastName, streetAddress, city, state, postcode }

    const insertedAddress = await AddressModel.create(newAddress) 

    res.status(201).send(insertedAddress)
  }
  catch(err) {
    res.status(500).send({ error: err.message })
  }
})

// Create an order
router.post('', async (req, res) => {
  try {
    const { addressId, total, cartId } = req.body 

    const addressObject = await AddressModel.findOne({ _id: addressId })
    if (addressObject) {
      const cartObject = await CartModel.findOne({ _id: cartId })
      if (cartObject) {
        const newOrder = { address: addressObject, total, cart: cartObject }

        const insertedOrder = await OrderModel.create(newOrder) 
    
        res.status(201).send(insertedOrder)
      } else {
        res.status(404).send({ error: 'Cart not found' })
      }
    } else {
      res.status(404).send({ error: 'Address not found' })
    }
  }
  catch(err) {
    res.status(500).send({ error: err.message })
  }
})


export default router