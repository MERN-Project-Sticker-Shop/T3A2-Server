import app from '../app.js'
import request from 'supertest'

let productId1
let productId2
let cartId1
let cartId2
let newCartid
let orderId
let addressId

// Test the home route
describe("App tests", () => {
  test('GET home page', async () => {
    const res = await request(app).get('/')
    expect(res.statusCode).toBe(200)
    expect(res.body.info).toBeDefined()
    expect(res.body.info).toBe('Sticker Shop API')
    expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
  })

  // Test the product routes to view all products
  describe("GET product lists", () => {
    let res

    // Define the route and http method
    beforeEach(async () => {   
      res = await request(app).get('/products')
      expect(res.statusCode).toBe(200)
      expect(res.headers['content-type']).toMatch(/json/i)
      })

    // Test the number of elements in the array
    it('Should return an array of 2 elements', () => {        
      expect(res.body).toBeInstanceOf(Array)
      expect(res.body.length).toBe(2)
    })

    // Test the data structure of the data returned
    it('Has an element with the correct data structure', () => {
      res.body.forEach(el => {
        expect(el._id).toBeDefined()
        expect(el.name).toBeDefined()
        expect(el.price).toBeDefined()
        expect(el.imageLinks).toBeDefined()
        expect(el.description).toBeDefined()
        expect(el._id.length).toBe(24)

      })
    })

    // Test the value of the data returned
    it('Has an element with the correct data value', () => {
        expect(res.body[0].name).toBe("R U OK")
        expect(res.body[0].price).toBe(10)
        expect(res.body[1].name).toBe("Autumn Vibes")
        expect(res.body[1].price).toBe(15)
        productId1 = res.body[0]._id
        productId2 = res.body[1]._id
    })
  })


  // Test to get a single product
  describe("GET a single product with valid product name", () => {
    let res

    // Define the route and http method
    beforeEach(async () => {
      res = await request(app).get('/products/R U OK')
      expect(res.statusCode).toBe(200)
      expect(res.headers['content-type']).toMatch(/json/i)      
    })

    // Test the value of the data returned
    it('Has an element with the correct data value', () => {
      expect(res.body.name).toBe("R U OK") 
      expect(res.body.price).toBe(10)
      expect(res.body.description).toBe("This is a sticker flakes")
    })

    // Test the data structure of the data returned
    it('Has an element with the correct data structure', () => {
        expect(res.body._id).toBeDefined()
        expect(res.body.name).toBeDefined()
        expect(res.body.price).toBeDefined()
        expect(res.body.imageLinks).toBeDefined()
        expect(res.body.description).toBeDefined()
        expect(res.body._id.length).toBe(24)
    })

    // Test to view a single product with invalid name
    test('GET a single product with invalid name', async () => {
      const res = await request(app).get('/products/R U OKA')
      expect(res.statusCode).toBe(404)
      expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
      expect(res.body).toEqual({"error": "Product not found!"})
    })
  })

  // Test the cart routes to get all carts
  describe("GET cart lists", () => {
    let res

    // Define the route and http method
    beforeEach(async () => {   
      res = await request(app).get('/carts')
      expect(res.statusCode).toBe(200)
      expect(res.headers['content-type']).toMatch(/json/i)
      })

    // Test the number of elements in the array
    it('Should return an array of 2 elements', () => {        
      expect(res.body).toBeInstanceOf(Array)
      expect(res.body.length).toBe(2)
    })

    // Test the data structure of the data returned  
    it('Has an element with the correct data structure', () => {
      res.body.forEach(el => {
        expect(el._id).toBeDefined()
        expect(el._id.length).toBe(24)
        expect(el.items).toBeDefined()
        el.items.forEach(subel => {
          expect(subel.product).toBeDefined()
          expect(subel.price).toBeDefined()
          expect(subel.quantity).toBeDefined()
        })  
      })
    })

    // Test the value of the data returned
    it('Has an element with the correct data value', () => {
      expect(res.body[0].items[0].product).toBe("R U OK")
      expect(res.body[0].items[0].quantity).toBe(1)
      expect(res.body[0].items[0].imageLink).toBe("https://i.postimg.cc/7Cgg0Tjt/RUOK1.jpg")
      expect(res.body[0].items[1].product).toBe("Autumn Vibes")
      expect(res.body[0].items[1].quantity).toBe(10)   
      expect(res.body[0].items[1].imageLink).toBe("https://i.postimg.cc/dhcPnbLH/1b32342cfbe061ad1733ace2f4ffb48.jpg")
      expect(res.body[1].items[0].product).toBe("Autumn Vibes")
      expect(res.body[1].items[0].quantity).toBe(20)
      expect(res.body[0].items[1].imageLink).toBe("https://i.postimg.cc/dhcPnbLH/1b32342cfbe061ad1733ace2f4ffb48.jpg")
      cartId1 = res.body[0]._id
      cartId2 = res.body[1]._id
      })
    }) 

  // Test the cart routes to get a single cart
  describe("GET a single cart", () => {
    let res
  
    // Define the route and http method
    beforeEach(async () => {   
      res = await request(app).get(`/carts/${cartId1}`)
      expect(res.statusCode).toBe(200)
      expect(res.headers['content-type']).toMatch(/json/i)
      })
   
    // Test the returned structure
    it('Should return an object', () => {        
      expect(res.body).toBeInstanceOf(Object)
    })
  
    // Test the data structure of the data returned  
    it('Has an element with the correct data structure', () => {
      expect(res.body._id).toBeDefined()
      expect(res.body.items).toBeDefined()
    })
    
    // Test the value of the data returned
    it('Has an element with the correct data value', () => {
      expect(res.body.items[0].product).toBe("R U OK")
      expect(res.body.items[0].quantity).toBe(1)
      expect(res.body.items[0].imageLink).toBe("https://i.postimg.cc/7Cgg0Tjt/RUOK1.jpg")
      expect(res.body.items[1].product).toBe("Autumn Vibes")
      expect(res.body.items[1].quantity).toBe(10)     
      expect(res.body.items[1].imageLink).toBe("https://i.postimg.cc/dhcPnbLH/1b32342cfbe061ad1733ace2f4ffb48.jpg")
    })
  })
    
  // Test to view a single cart with invalid cartid
  test('GET a single cart with invalid cartid', async () => {
    const res = await request(app).get('/carts/63d479f9b4c1cb86f6d30b8f')
    expect(res.statusCode).toBe(404)
    expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
    expect(res.body).toEqual({"error": "Cart Item not found!"})
  })

  // Test to view a single cart with cartid in the wrong format
  test('GET a single cart with cartid in the wrong format', async () => {
    const res = await request(app).get('/carts/63d479f9')
    expect(res.statusCode).toBe(404)
    expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
    expect(res.body).toEqual({"error": "Invalid Cart Id"})
  })

  // Test the route to add product to the cart with valid cartid
  test("Add existing product to the cart with valid cartid", async () => {
    const res = await request(app).post(`/carts/${cartId1}/Autumn Vibes`).send({
      quantity: 30
    })
    expect(res.status).toBe(201)
    expect(res.headers['content-type']).toMatch(/json/i)
    expect(res.body._id).toBeDefined()
    expect(res.body.items[0].product).toBe("R U OK") 
    expect(res.body.items[0].imageLink).toBe("https://i.postimg.cc/7Cgg0Tjt/RUOK1.jpg") 
    expect(res.body.items[0].price).toBe(10)
    expect(res.body.items[0].quantity).toBe(1)
    expect(res.body.items[1].product).toBe("Autumn Vibes")  
    expect(res.body.items[1].price).toBe(15)
    expect(res.body.items[1].quantity).toBe(30)    
    expect(res.body.items[1].imageLink).toBe("https://i.postimg.cc/dhcPnbLH/1b32342cfbe061ad1733ace2f4ffb48.jpg")
  })

  // Test the route to add product to the cart with valid cartid
  test("Add new product to the cart with valid cartid", async () => {
    const res = await request(app).post(`/carts/${cartId2}/R U OK`).send({
      quantity: 30
    })
    expect(res.status).toBe(201)
    expect(res.headers['content-type']).toMatch(/json/i)
    expect(res.body._id).toBeDefined()
    expect(res.body.items[0].product).toBe("Autumn Vibes")  
    expect(res.body.items[0].price).toBe(15)
    expect(res.body.items[0].quantity).toBe(20)  
    expect(res.body.items[0].imageLink).toBe("https://i.postimg.cc/dhcPnbLH/1b32342cfbe061ad1733ace2f4ffb48.jpg")
    expect(res.body.items[1].product).toBe("R U OK") 
    expect(res.body.items[1].price).toBe(10)
    expect(res.body.items[1].quantity).toBe(30)  
    expect(res.body.items[1].imageLink).toBe("https://i.postimg.cc/7Cgg0Tjt/RUOK1.jpg") 
  })

  // Test the route to add product to the cart with invalid cartid
  test("Add product to the cart with invalid cartid", async () => {
    const res = await request(app).post('/carts/63d35c8f2c13144a29ec899a/Autumn Vibes').send({
      quantity: 15
    })
    expect(res.status).toBe(404)
    expect(res.headers['content-type']).toMatch(/json/i)
    expect(res.body).toEqual({"error": "Cart Item not found!"})
  })

  // Test the route to add product to the cart without cartid, will create a new cart
  test("Add product to the cart without cartid", async () => {
    const res = await request(app).post('/carts/null/R U OK').send({
      quantity: 15
    })
    expect(res.status).toBe(201)
    expect(res.headers['content-type']).toMatch(/json/i)
    expect(res.body._id).toBeDefined()
    expect(res.body.items[0].product).toBe("R U OK") 
    expect(res.body.items[0].price).toBe(10)
    expect(res.body.items[0].quantity).toBe(15)
    expect(res.body.items[0].imageLink).toBe("https://i.postimg.cc/7Cgg0Tjt/RUOK1.jpg") 
    newCartid = res.body._id
    })

  // Test the route to add product to the cart with invalid product name
  test("Add product to the cart with invalid product name", async () => {
    const res = await request(app).post(`/carts/${cartId1}/R U OKA`).send({
      quantity: 15
    })
    expect(res.status).toBe(404)
    expect(res.headers['content-type']).toMatch(/json/i)
    expect(res.body).toEqual({"error": "Product not found!"})
  })

  // Test to get all orders
  describe("GET order lists", () => {
    let res
  
    // Define the route and http method
    beforeEach(async () => {   
      res = await request(app).get('/orders')
      expect(res.statusCode).toBe(200)
      expect(res.headers['content-type']).toMatch(/json/i)
      })
    
    // Test the number of elements in the array
    it('Should return an array of 2 elements', () => {        
      expect(res.body).toBeInstanceOf(Array)
      expect(res.body.length).toBe(2)
    })
    
    // Test the data structure of the data returned
    it('Has an element with the correct data structure', () => {
      res.body.forEach(el => {
        expect(el._id).toBeDefined()
        expect(el._id.length).toBe(24)
        expect(el.total).toBeDefined()
        expect(el.address).toBeDefined()
        expect(el.cart).toBeDefined()
      }) 
    })
      
    // Test the value of the data returned
    it('Has an element with the correct data value', () => {
      expect(res.body[0].cart.items[0].product).toBe('R U OK') 
      expect(res.body[0].cart.items[0].price).toBe(10)
      expect(res.body[0].cart.items[0].quantity).toBe(1)
      expect(res.body[0].cart.items[1].product).toBe('Autumn Vibes')  
      expect(res.body[0].cart.items[1].price).toBe(15)
      expect(res.body[0].cart.items[1].quantity).toBe(30)
      expect(res.body[0].total).toBe(160)
      expect(res.body[0].address.email).toBe("12345@gmail.com")
      expect(res.body[1].cart.items[0].product).toBe('Autumn Vibes') 
      expect(res.body[1].cart.items[0].price).toBe(15)
      expect(res.body[1].cart.items[0].quantity).toBe(20)
      orderId = res.body[0]._id
    })
  })

   // Test to get a single order
   describe("GET a single order with valid orderid", () => {
    let res
    
    // Define the route and http method
    beforeEach(async () => {
      res = await request(app).get(`/orders/${orderId}`)
      expect(res.statusCode).toBe(200)
      expect(res.headers['content-type']).toMatch(/json/i)      
    })
    
    // Test the value of the data returned
    it('Has an element with the correct data value', () => {
      expect(res.body.cart.items[0].product).toBe('R U OK') 
      expect(res.body.cart.items[0].price).toBe(10)
      expect(res.body.total).toBe(160)
      expect(res.body.address.email).toBe("12345@gmail.com")
    })
    
    // Test the data structure of the data returned
    it('Has an element with the correct data structure', () => {
        expect(res.body._id).toBeDefined()
        expect(res.body.cart).toBeDefined()
        expect(res.body.cart.items).toBeDefined()
        expect(res.body._id.length).toBe(24)
        expect(res.body.total).toBeDefined()
        expect(res.body.address).toBeDefined()
    })
  })

  // Test to get a single order with invalid order id
  test("GET a single order with invalid orderid", async () => {

    // Define the route and http method
    const res = await request(app).get('/orders/63d36c902c13144a29ec86a3')
      expect(res.statusCode).toBe(404)
      expect(res.headers['content-type']).toMatch(/json/i)     
      expect(res.body).toEqual({"error": "Order not found!"})
  })

  // Test to get a single order with order id in the wrong format
  test("GET a single order with orderid in the wrong format", async () => {

    // Define the route and http method
    const res = await request(app).get('/orders/63d48fb6055')
      expect(res.statusCode).toBe(500)
      expect(res.headers['content-type']).toMatch(/json/i)     
      expect(res.body).toEqual({"error": "Invalid Order Id"})
  })

  // Test to add new address
  test("Add new address", async () => {
    const res = await request(app).post('/orders/address').send({
      email: '6789977@gmail.com',
      firstName: 'Bob',
      lastName: 'Tian',
      phone: '0411112321',
      streetAddress: '188 Swanston Street',
      suburb: 'Melbourne',
      state: 'VIC',
      postcode: 3000
    })
    expect(res.status).toBe(201)
    expect(res.headers['content-type']).toMatch(/json/i)
    expect(res.body._id).toBeDefined()
    expect(res.body.email).toBe('6789977@gmail.com')
    expect(res.body.firstName).toBe('Bob')
    expect(res.body.lastName).toBe('Tian')
    expect(res.body.phone).toBe('0411112321')
    expect(res.body.streetAddress).toBe('188 Swanston Street')
    expect(res.body.suburb).toBe('Melbourne')
    expect(res.body.state).toBe('VIC')
    expect(res.body.postcode).toBe(3000)
    addressId = res.body._id
  })

  // Test to add new address with missing field
  test("Add new address", async () => {
    const res = await request(app).post('/orders/address').send({
      firstName: 'Bob',
      lastName: 'Tian',
      phone: '0411112321',
      streetAddress: '188 Swanston Street',
      suburb: 'Melbourne',
      state: 'VIC',
      postcode: 3000
    })
    expect(res.status).toBe(500)
    expect(res.headers['content-type']).toMatch(/json/i)
  })

  // Test to add new order with valid ids
  test("Add new orders with valid id", async () => {
    const res = await request(app).post('/orders').send({
      "addressId":`${addressId}`,
      "total": 500,
      "cartId": `${cartId1}`
    })
    expect(res.status).toBe(201)
    expect(res.headers['content-type']).toMatch(/json/i)
    expect(res.body._id).toBeDefined()
    expect(res.body.cart.items[0].product).toBe('R U OK') 
    expect(res.body.cart._id).toBe(`${cartId1}`) 
    expect(res.body.total).toBe(500)
    expect(res.body.address._id).toBe(`${addressId}`)
  })

  // Test to add new orders with invalid address id
  test("Add new orders with invalid address id", async () => {
    const res = await request(app).post('/orders').send({
      "addressId":"63d45d962acdcc5d6510f7f0",
      "total": 500,
      "cartId": `${cartId1}`
    })
    expect(res.status).toBe(404)
    expect(res.headers['content-type']).toMatch(/json/i)
    expect(res.body).toEqual({"error": "Address not found!"})
  })

  // Test to add new orders with invalid cart id
  test("Add new orders with invalid cart id", async () => {
    const res = await request(app).post('/orders').send({
      "addressId":`${addressId}`,
      "total": 500,
      "cartId": "63d3b9997ef8672097aff9a0"
    })
    expect(res.status).toBe(404)
    expect(res.headers['content-type']).toMatch(/json/i)
    expect(res.body).toEqual({"error": "Cart not found!"})
  })

  // Test to add new orders with cart id that has wrong format
  test("Add new orders with cart id in wrong format", async () => {
    const res = await request(app).post('/orders').send({
      "addressId":`${addressId}`,
      "total": 500,
      "cartId": "63d3b9997ef"
    })
    expect(res.status).toBe(500)
    expect(res.headers['content-type']).toMatch(/json/i)
  })

  // Test to delete a cart item
  test("Delete a product in the cart with valid cartid", async () => {
    const res = await request(app).delete(`/carts/${cartId1}/Autumn Vibes`)
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/json/i)
    expect(res.body._id).toBeDefined()
    expect(res.body.items[0].product).toBe("R U OK") 
    expect(res.body.items[0].price).toBe(10)
    expect(res.body.items[0].quantity).toBe(1)
    expect(res.body.items[0].imageLink).toBe("https://i.postimg.cc/7Cgg0Tjt/RUOK1.jpg")
  })

  // Test to delete a cart item in the cart with invalid cartid
  test("Delete a product in the cart with invalid cartid", async () => {
    const res = await request(app).delete('/carts/63d479f9b4c1cb86f6d30b8f/Autumn Vibes')
    expect(res.status).toBe(404)
    expect(res.headers['content-type']).toMatch(/json/i)
    expect(res.body).toEqual({"error": "Cart Item not found!"})
  })
  
  // Test to delete a cart item in the cart with invalid product name
  test("Delete a product in the cart with invalid product name", async () => {
    const res = await request(app).delete(`/carts/${cartId1}/Autumn and Spring Vibes`)
    expect(res.status).toBe(404)
    expect(res.headers['content-type']).toMatch(/json/i)
    expect(res.body).toEqual({"error": "Product not found!"})
  })

  // Test to delete a cart with valid cartid
  test("Delete the cart with valid cartid", async () => {
    const res = await request(app).delete(`/carts/${newCartid}`)
    expect(res.status).toBe(204)
  })
    
  // Test to delete a cart with invalid cartid
  test("Delete the cart with invalid cartid", async () => {
    const res = await request(app).delete('/carts/63d479f9b4c1cb86f6d30b8f')
    expect(res.status).toBe(404)
    expect(res.headers['content-type']).toMatch(/json/i)
    expect(res.body).toEqual({"error": "Cart not found!"})
  })

  // Test to delete a cart with cartid in the wrong format
  test("Delete the cart with cartid in the wrong format", async () => {
    const res = await request(app).delete('/carts/63d479f9b4c')
    expect(res.status).toBe(500)
    expect(res.headers['content-type']).toMatch(/json/i)
    expect(res.body).toEqual({"error": "Invalid Cart Id"})
  })
})
