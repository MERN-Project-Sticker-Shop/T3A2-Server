import express from 'express'
import { CartModel, ProductModel } from '../db.js'

const router = express.Router()

//Get all cart items
router.get('', async (req, res) => {
  res.send(await CartModel.find())
})

//Add products to cart
router.post('/:name', async (req, res) => {
  try {
    const productName = req.params.name
    //Find the product
    const productObject = await ProductModel.findOne({ name: productName })
    const { quantity } = req.body
    const newCartitem = { item: [{product: productObject.name, price: productObject.price, quantity}] }
    const insertedCartitem = await CartModel.create(newCartitem)
    res.status(201).send(insertedCartitem)
    }
  catch(err) {
        res.status(500).send({ error: err.message })
  }
})

//Update products in cart
router.patch('/:cartid/:name', async (req, res) => {
  const cartObject = await CartModel.findOne({ _id: req.params.cartid  })
  if (cartObject) {
    const productObject = await ProductModel.findOne({ name: req.params.name }) 
    const { quantity } = req.body

    const cartItem = cartObject.item
    const filteredCartitem = cartItem.filter(item => item.product !== req.params.name)

    const newCartitem = { product: productObject.name, quantity, price: productObject.price }
    filteredCartitem.push(newCartitem)
    const result = {item: filteredCartitem}


  try {
    //Find and update the product in cart
    const cartItem = await CartModel.findByIdAndUpdate(req.params.cartid, result, { new: true})
    if (cartItem) {
      res.send(cartItem)
    } else {
      res.status(404).send({error:'Cart Item not found!'})
  }}
  catch(err) {
    res.status(500).send({ error: err.message})
  }}
})

//Delete the product
router.delete('/:cartid/:name', async (req, res) => {
  const cartObject = await CartModel.findOne({ _id: req.params.cartid  })
  if (cartObject) {
    const cartItem = cartObject.item
    const filteredCartitem = cartItem.filter(item => item.product !== req.params.name)
    try {
      //Find and update the product in cart
   const product = req.params.name

      const newItem = await CartModel.findByIdAndDelete(cartObject)
      if (newItem) {
        res.status(204).send(newItem)
      } else {
        res.status(404).send({error:'Cart Item not found!'})
    }}
    catch(err) {
      res.status(500).send({ error: err.message})
    }}
  })



export default router