import { CartModel, ProductModel } from '../db.js'


// Verify product
async function checkProduct(productName, quantity) {
  // Find the product object that matches the product name
  const productObject = await ProductModel.findOne({ name: productName })
  // If found, create a new cart item using this product object
  if (productObject) {
    const newCartitem = { product: productObject.name, price: productObject.price, quantity, imageLink: productObject.imageLinks[0]}
    return newCartitem
  // If not, return the error message
  } else {
    return 'Product not found!'
  }
}

// Verify cart
async function checkCart(id) {
  // Find the cart object that matches the the cart id
  // Use try/except to catch exceptions if entered invalid cart id
  try{
  const cartObject = await CartModel.findById({ _id: id  })
    // If found, return the cart object
    if (cartObject) {
      return cartObject
    // If not, return the error message
    } else {
      return 'Cart Item not found!'
    }
  } 
  catch(err) {
    return 'Invalid Cart Id'
  }

}

// Update cart item and quantity
async function updateCart(id, result, res) {
    // Verify the cart first and return the cart object if found

    const cartResult = await checkCart(id, res)
    // If the cart object exists
    if (cartResult !=='Cart Item not found!' & cartResult !=='Invalid Cart Id') {
      // Obtain the name of the product
      const productName = result.product
      // Check whether the product already exists in the cart
      const found = cartResult.items.find(obj => {
        return obj.product.toString() === productName.toString()
      })
      // If yes, update the quantity
      if (found) {
          found.quantity = result.quantity
      // If not, add new product to the cart
      }else {
        cartResult.items.push(result)
      }
      // Update the item array
      const updatedCartitem = {items: cartResult.items}
      // Update the database
        const newItem = await CartModel.findByIdAndUpdate(id, updatedCartitem, { new: true})
        res.status(201).send(await newItem)
      }
      // If not, send the error message
     else {
      res.status(404).send({ error: cartResult })
    }
}

// Get all carts
async function getAllCart(req, res) {
  res.send(await CartModel.find())
}

// Get a single cart
async function getSingleCart(req, res) {
  // Obtain cartid
  const id = req.params.cartid
  // Check whether cart exists. If exists, send the cart object. If not, return the error message
  const cartResult = await checkCart(id)
  if (cartResult !=='Cart Item not found!' & cartResult !=='Invalid Cart Id') {
    res.send(await cartResult)
  } else {
    res.status(404).send({ error: cartResult })
  } 
}

// Add products to cart and update product quantity
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
      const newCartitem = { items: [result] }
      
      // Create a new instance of cart model and insert the newly created item array
      const insertedCartitem = await CartModel.create(newCartitem)
      res.status(201).send(await insertedCartitem)
      }
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
      // If cart exists
      if (cartItem !== 'Cart Item not found!' & cartItem !== 'Invalid Cart Id') {
        // Filter out product that match the name parameters in the url and create a new array
        const newCartitem = cartItem.items.filter(item => {
          return item.product.toString() !== result.product.toString()})
        // Update the cart with the filtered item array
        const newItem = await CartModel.findByIdAndUpdate(req.params.cartid, {items: newCartitem}, { new: true })
        // Send the updated array
        res.send(await newItem)
        // If cart not exists, send the error message
      } else {
        res.status(404).send({ error: cartItem })
      }
    // If product not exists, send the error message
    } else {
      res.status(404).send({ error: result })
    }
  }

//Delete the whole cart
async function deleteCart(req, res) {
  // Delete the cart with the id defined in the url
  // Use try/except to catch exceptions if entered invalid cart id
  try {
    // Find and delete the cart
    const cartItem = await CartModel.findByIdAndDelete(req.params.cartid)
    // If cart exists, delete it. If not, return the error message
    if (cartItem) {
      res.sendStatus(204)
    // If cart not exists, send the error message
    } else {
      res.status(404).send({error: 'Cart not found!'})
    }
  }
  catch(err) {
    res.status(500).send({ error: 'Invalid Cart Id' })
}
}

export { getAllCart, getSingleCart, addProduct, deleteProduct, deleteCart, checkProduct, checkCart, updateCart }