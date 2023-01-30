import { CartModel, ProductModel } from '../db.js'


// Verify product
async function checkProduct(productName, quantity) {
  // Find the product object that matches the product name
  const productObject = await ProductModel.findOne({ name: productName })
  // If found, create a new cart item using this product object
  if (productObject) {
    const newCartitem = { product: productObject, price: productObject.price, quantity}
    return newCartitem
  // If not, return the error message
  } else {
    return 'Product not found!'
  }
}

// Verify cart
async function checkCart(id) {
  // Find the cart object that matches the the cart id
  const cartObject = await CartModel.findById({ _id: id  })
  // If found, obtain the item array from the cart object
  if (cartObject) {
    return cartObject
  // If not, return the error message
  } else {
    return 'Cart Item not found!'
  }
}

// Update cart item and quantity
async function updateCart(id, result, res) {
    // Verify the cart first and return the item array of the cart
    const cartResult = await checkCart(id)
    // If the cart item exists
    if (cartResult !== 'Cart Item not found!') {
      // Obtain the objectID of the product
      const productObject = result.product
      // Check whether the product already exists in the cart
      const found = cartResult.item.find(obj => {
        return obj.product.toString() === productObject._id.toString()
      })
      // If yes, update the quantity
      if (found) {
          found.quantity = result.quantity
      // If not, add new product to the cart
      }else {
        cartResult.item.push(result)
      }
      // Update the item array
      const updatedCartitem = {item: cartResult.item}
      // Update the database
      try {
        const newItem = await CartModel.findByIdAndUpdate(id, updatedCartitem, { new: true})
        res.status(201).send(await newItem.populate( { path: 'item.product', select: 'name description imageLinks'}))
      }
      catch(err) {
        res.status(500).send({ error: err.message })
      }
    } else {
      res.status(404).send({ error: cartResult })
    }
}

// Get all carts
async function getAllCart(req, res) {
  res.send(await CartModel.find().populate({ path:'item.product', select: 'name description imageLinks'}))
}

// Get a single cart
async function getSingleCart(req, res) {
  // Obtain cartid
  const id = req.params.cartid
  // Check whether cart exists. If exists, send the cart object. If not, return the error message
  const cartResult = await checkCart(id)
  if (cartResult !=='Cart Item not found!') {
    res.send(await cartResult.populate({ path:'item.product', select: 'name description imageLinks'}))
  } else {
    res.status(404).send({ error: cartResult})
  }
}

// Add products to cart
async function addProduct(req, res) {
  // Check whether the product is a valid product
  const result = await checkProduct(req.params.name, req.body.quantity)
  // If product is valid, add it to cart. If not, return the error message
  if (result !== 'Product not found!') {
    // If cart exist, update the existing cart. If not, create a new cart
    if (req.params.cartid !== 'null') {
      await updateCart(req.params.cartid, result, res)
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
}

// Update products in cart
async function updateProduct(req, res) {
  // Check whether product exists 
  const result = await checkProduct(req.params.name, req.body.quantity)
  // If cart extists, update the cart
  if (result !== 'Product not found!') {
    await updateCart(req.params.cartid, result, res)
  } else {
    res.status(404).send({ error: result })
  }
}

//Delete one of the product from the cart
async function deleteProduct(req, res) {
    // Check whether product exists 
    const result = await checkProduct(req.params.name, null)
    if (result !== 'Product not found!') {
      // Check whether cart exists
      const cartItem = await checkCart(req.params.cartid,res)
      if (cartItem !== 'Cart Item not found!') {
        // Filter out product that match the name parameters in the url and create a new array
        const newCartitem = cartItem.item.filter(item => {
          return item.product.toString() !== result.product._id.toString()})
        // Update the cart with the filtered item array
        const newItem = await CartModel.findByIdAndUpdate(req.params.cartid, {item: newCartitem}, { new: true })
        // Send the updated array
        res.send(await newItem.populate( { path: 'item.product', select: 'name description imageLinks'}))
      } else {
        res.status(404).send({ error: cartItem })
      }
    } else {
      res.status(404).send({ error: result })
    }
}

//Delete the whole cart
async function deleteCart(req, res) {
  // Delete the cart with the id defined in the url
  try {
    const cartItem = await CartModel.findByIdAndDelete(req.params.cartid)
    // If cart exitst, delete it. If not, return the error message
    if (cartItem) {
      res.sendStatus(204)
    } else {
      res.status(404).send({error: 'Cart not found!'})
    }
  }
  catch(err) {
    res.status(500).send({ error: err.message })
}
}

export { getAllCart, getSingleCart, addProduct, updateProduct, deleteProduct, deleteCart }