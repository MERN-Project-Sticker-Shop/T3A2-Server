import express from 'express'
import { ProductModel } from '../db.js'

const router = express.Router()

//Get all products
router.get('', async (req, res) => {
  res.send(await ProductModel.find())
})

//Get a single product by name
router.get('/:name', async (req, res) => {
  try {
    const productName = req.params.name
    const product = await ProductModel.findOne({ name: productName })
    if (product) {
      res.send(product)
    } else {
      res.status(404).send({ error: 'Product not found!' })
    }}
  catch (err) {
    res.status(500).send({ error: err.message })
  }
})

export default router