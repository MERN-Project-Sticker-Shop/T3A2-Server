import express from 'express'
import { getAllProduct, getSingleProduct } from '../controllers/product_controller'

const router = express.Router()

//Get all products
router.get('', getAllProduct)

//Get a single product by name
router.get('/:name', getSingleProduct)

export default router