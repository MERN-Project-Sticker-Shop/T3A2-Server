import express from 'express'
import { getAllOrder, getSingleOrder, createAddress, createOrder } from '../controllers/order_controller.js'
const router = express.Router()

// Get all orders
router.get('', getAllOrder)

// Get a single order
router.get('/:orderid', getSingleOrder)

// Create an address
router.post('/address', createAddress)

// Create an order
router.post('', createOrder)


export default router