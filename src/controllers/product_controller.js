import { ProductModel } from '../db.js'


async function getAllProduct (req, res) {
  res.send(await ProductModel.find())
}

async function getSingleProduct (req, res) {
  const productName = req.params.name
  const product = await ProductModel.findOne({ name: productName })
  if (product) {
    res.send(product)
  } else {
    res.status(404).send({ error: 'Product not found!' })
  }
}

export { getAllProduct, getSingleProduct }