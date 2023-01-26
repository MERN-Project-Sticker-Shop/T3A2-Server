import express from 'express'
import { OrderModel } from '../db.js'

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


export default router