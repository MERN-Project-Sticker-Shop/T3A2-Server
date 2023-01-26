import express from 'express'
import { CartModel, ProductModel } from '../db.js'


const router = express.Router()

// Verify product
async function checkProduct(productName, quantity) {
  const productObject = await ProductModel.findOne({ name: productName })
  if (productObject) {
    const newCartitem = {product: productObject.name, price: productObject.price, quantity}
    return newCartitem
  } else {
    return 'Product not found!'
  }
}

// Update the cart items includes products and quantities
async function checkCart(id, res) {
  const cartObject = await CartModel.findOne({ _id: id  })
  if (cartObject) {
    const cartItem = cartObject.item
    return cartItem
  }else {
    return 'Cart Item not found!'
  }
}

async function updateCart(id, productName, result, res) {
    const cartResult = await checkCart(id, res)
    if (cartResult !== 'Cart Item not found!') {
      for (var i in cartResult) {
        if (cartResult[i].product === productName) {
          cartResult[i].quantity += result.quantity
        }else {
          cartResult.push(result)
        }}
  //Updated cart item
      const updatedCartitem = {item: cartResult}
      try {
        const newItem = await CartModel.findByIdAndUpdate(id, updatedCartitem, { new: true})
        res.send(newItem)
      }
      catch(err) {
        res.status(500).send({ error: err.message })
      }
    } else {
      res.status(404).send({error:cartResult})
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
      await updateCart(req.params.cartid, req.params.name, result, res)
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
    await updateCart(req.params.cartid, req.params.name, result, res)
  } else {
    res.status(404).send({ error: result })
  }
})

//Delete one of the product from the cart
router.delete('/:cartid/:name', async (req, res) => {
    const result = await checkProduct(req.params.name, null)
    if (result !== 'Product not found!') {
      const cartItem = await checkCart(req.params.cartid,res)
      if (cartItem !== 'Cart Item not found!') {
        const newCartitem = cartItem.filter(item => item.product !== req.params.name)
        const newItem = await CartModel.findByIdAndUpdate(req.params.cartid, {item: newCartitem}, { new: true })
        res.status(204).send(newItem)
      } else {
        res.status(404).send({ error: cartItem })
      }
    } else {
      res.status(404).send({ error: result })
    }
})

//Delete the whoe cart
router.delete('/:cartid', async (req, res) => {
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