import { ProductModel } from '../db.js'

// Get all products
async function getAllProduct (req, res) {
  res.send(await ProductModel.find())
}

// Get a single product
async function getSingleProduct (req, res) {
  // Obtain the name of the product
  const productName = req.params.name
  // Check if the product exists
  const product = await ProductModel.findOne({ name: productName })
  // If exists, return the product object. If not, return the error message
  if (product) {
    res.send(product)
  } else {
    res.status(404).send({ error: 'Product not found!' })
  }
}

export { getAllProduct, getSingleProduct }