import express from 'express'
import { CartModel, ProductModel } from '../db.js'

const router = express.Router()

async function checkProduct(productName, quantity) {
  const productObject = await ProductModel.findOne({ name: productName })
  if (productObject) {
    const newCartitem = {product: productObject.name, price: productObject.price, quantity}
    return newCartitem
  } else {
    return 'Product not found!'
  }
}

async function updateQuantity(id, name, result, res) {
  //Find the existing cart model and obtain the cart items
  const cartObject = await CartModel.findOne({ _id: id  })
  const cartItem = cartObject.item
  //Add new item to the cart items array
  //If item already exists, update the quantity number
  for (var i in cartItem) {
    if (cartItem[i].product === name) {
      cartItem[i].quantity += result.quantity
    }}
  //Updated cart item
  const updatedCartitem = {item: cartItem}
  try {
    const newItem = await CartModel.findByIdAndUpdate(id, updatedCartitem, { new: true})
    res.send(newItem)
  }
  catch(err) {
    res.status(500).send({ error: err.message })
  }
}

//Get all cart items
router.get('', async (req, res) => {
  res.send(await CartModel.find())
})

//Add products to cart
router.post('/:cartid/:name', async (req, res) => {
  //Check whether the product is a valid product
  const result = await checkProduct(req.params.name, req.body.quantity)
  //If product is valid, add it to cart. If not, return the error message
  if (result !== 'Product not found!') {
    //If cart exist, update the existing cart. If not, create a new cart
    if (req.params.cartid !== 'null') {
      await updateQuantity(req.params.cartid, req.params.name, result, res)
      //Create new cart
    } else {
      const newCartitem = { item: [result] }
      try {
        // Create a new cart model
        const insertedCartitem = await CartModel.create(newCartitem)
        res.status(201).send(insertedCartitem)
        }
      catch(err) {
        res.status(500).send({ error: err.message })
      }}
  } else {
    res.status(404).send({ error: result })
  }
})

//Update products in cart
router.patch('/:cartid/:name', async (req, res) => {
  const result = await checkProduct(req.params.name, req.body.quantity)
  if (result !== 'Product not found!') {
    const cartObject = await CartModel.findOne({ _id: req.params.cartid  })
    if (cartObject) {
      await updateQuantity(req.params.cartid, req.params.name, result, res)
    }else {
      res.status(404).send({error:'Cart Item not found!'})
    }
  } else {
    res.status(404).send({ error: result })
  }
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