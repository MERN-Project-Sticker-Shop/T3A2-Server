import express from 'express'
import { CartModel, ProductModel } from '../db.js'


const router = express.Router()

// Verify product
async function checkProduct(productName, quantity) {
  const productObject = await ProductModel.findOne({ name: productName })
  if (productObject) {
    const newCartitem = { product: productObject, price: productObject.price, quantity}
    return newCartitem
  } else {
    return 'Product not found!'
  }
}

// Verify cart
async function checkCart(id) {
  const cartObject = await CartModel.findOne({ _id: id  })
  if (cartObject) {
    const cartItem = cartObject.item
    return cartItem
  }else {
    return 'Cart Item not found!'
  }
}

// Update cart item and quantity
async function updateCart(id, productName, result, res) {
    const cartResult = await checkCart(id, res)
    if (cartResult !== 'Cart Item not found!') {
      // Find the product and update the quantity

      const productObject = await ProductModel.findOne({ name: productName })
      const found = cartResult.find(obj => {
        return obj.product.toString() === productObject._id.toString()
      })

      if (found) {
          found.quantity += result.quantity
      }else {
        cartResult.push(result)
      }
      // Update the item array
      const updatedCartitem = {item: cartResult}
      // Update the database
      try {
        const newItem = await CartModel.findByIdAndUpdate(id, updatedCartitem, { new: true})
        res.send(await newItem.populate( { path: 'item.product', select: 'name description imageLinks'}))
      }
      catch(err) {
        res.status(500).send({ error: err.message })
      }
    } else {
      res.status(404).send({ error: cartResult })
    }
}

// Get all cart items
router.get('', async (req, res) => {
  res.send(await CartModel.find().populate({ path:'item.product', select: 'name description imageLinks'}))
})

// Add products to cart
router.post('/:cartid/:name', async (req, res) => {
  // Check whether the product is a valid product
  const result = await checkProduct(req.params.name, req.body.quantity)
  // If product is valid, add it to cart. If not, return the error message
  if (result !== 'Product not found!') {
    // If cart exist, update the existing cart. If not, create a new cart
    if (req.params.cartid !== 'null') {
      await updateCart(req.params.cartid, req.params.name, result, res)
    // Cart not exists, create a new item array
    } else {
      const newCartitem = { item: [result] }
      try {
        // Create a new instance of cart model and insert the newly created item array
        const insertedCartitem = await CartModel.create(newCartitem)
        res.status(201).send(await insertedCartitem.populate( { path: 'item.product', select: 'name description imageLinks'}))
        }
      catch(err) {
        res.status(500).send({ error: err.message })
      }}
  } else {
    res.status(404).send({ error: result })
  }
})

// Update products in cart
router.patch('/:cartid/:name', async (req, res) => {
  // Check whether product exists 
  const result = await checkProduct(req.params.name, req.body.quantity)
  if (result !== 'Product not found!') {
    // Update the cart
    await updateCart(req.params.cartid, req.params.name, result, res)
  } else {
    res.status(404).send({ error: result })
  }
})

//Delete one of the product from the cart
router.delete('/:cartid/:name', async (req, res) => {
    // Check whether product exists 
    const result = await checkProduct(req.params.name, null)
    if (result !== 'Product not found!') {
      // Check whether cart exists
      const cartItem = await checkCart(req.params.cartid,res)
      if (cartItem !== 'Cart Item not found!') {
        // Filter out product that match the name parameters in the url
        const newCartitem = cartItem.filter(item => item.product !== req.params.name)
        // Update the cart with the filtered item array
        const newItem = await CartModel.findByIdAndUpdate(req.params.cartid, {item: newCartitem}, { new: true })
        res.status(204).send(newItem)
      } else {
        res.status(404).send({ error: cartItem })
      }
    } else {
      res.status(404).send({ error: result })
    }
})

//Delete the whole cart
router.delete('/:cartid', async (req, res) => {
  // Delete the cart with the id defined in the url
  try {
    const cartItem = await CartModel.findByIdAndDelete(req.params.cartid)
    if (cartItem) {
      res.sendStatus(204)
    } else {
      res.status(404).send({error: 'Cart not found!'})
    }
  }
  catch(err) {
    res.status(500).send({ error: err.message })
}
})

export default router