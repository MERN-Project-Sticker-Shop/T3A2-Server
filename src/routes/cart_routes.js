import express from 'express'
import { getAllCart, getSingleCart, addProduct, deleteProduct, deleteCart } from '../controllers/cart_controller.js'

const router = express.Router()

// Get all carts
router.get('', getAllCart)

// Get a single cart
router.get('/:cartid', getSingleCart)

// Add products to cart
router.post('/:cartid/:name', addProduct)

//Delete one of the product from the cart
router.delete('/:cartid/:name', deleteProduct)

//Delete the whole cart
router.delete('/:cartid', deleteCart)

export default router