import express from 'express'
import { getAllCart, getSingleCart, addProduct, updateProduct, deleteProduct, deleteCart } from '../controllers/cart_controller'

const router = express.Router()

// Get all carts
router.get('', getAllCart)

// Get a single cart
router.get('/:cartid', getSingleCart)

// Add products to cart
router.post('/:cartid/:name', addProduct)

// Update products in cart
router.patch('/:cartid/:name', updateProduct)

//Delete one of the product from the cart
router.delete('/:cartid/:name', deleteProduct)

//Delete the whole cart
router.delete('/:cartid', deleteCart)

export default router