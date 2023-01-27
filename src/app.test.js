import app from './app.js'
import request from 'supertest'

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
      expect(res.body[0].description).toBe("This is a sticker flakes")
      expect(res.body[1].name).toBe("Autumn Vibes")  
      expect(res.body[1].price).toBe(15)
      expect(res.body[1].description).toBe("This is a autumn sticker sheet")
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
          expect(el.item).toBeDefined()
          el.item.forEach(subel => {
            expect(subel.product).toBeDefined()
            expect(subel.price).toBeDefined()
            expect(subel.quantity).toBeDefined()
          })  
        })
      })
      // Test the value of the data returned
      it('Has an element with the correct data value', () => {
        expect(res.body[0].item[0].product.name).toBe("R U OK") 
        expect(res.body[0].item[0].product.description).toBe("This is a sticker flakes")
        expect(res.body[0].item[0].price).toBe(10)
        expect(res.body[0].item[0].quantity).toBe(1)
        expect(res.body[0].item[1].product.name).toBe("Autumn Vibes")  
        expect(res.body[0].item[1].product.description).toBe("This is a autumn sticker sheet")
        expect(res.body[0].item[1].price).toBe(15)
        expect(res.body[0].item[1].quantity).toBe(10)       
        expect(res.body[1].item[0].product.name).toBe("Autumn Vibes")  
        expect(res.body[1].item[0].product.description).toBe("This is a autumn sticker sheet")
        expect(res.body[1].item[0].price).toBe(15)
        expect(res.body[1].item[0].quantity).toBe(20)

      })
    }) 

    test("Add product to the cart with valid cartid", async () => {
      const res = await request(app).post('/carts/63d35c8f2c13144a29ec869a/Autumn Vibes').send({
        quantity: 15
      })
      expect(res.status).toBe(201)
      expect(res.headers['content-type']).toMatch(/json/i)
      expect(res.body._id).toBeDefined()
      expect(res.body.item[0].product.name).toBe("R U OK") 
      expect(res.body.item[0].product.description).toBe("This is a sticker flakes")
      expect(res.body.item[0].price).toBe(10)
      expect(res.body.item[0].quantity).toBe(1)
      expect(res.body.item[1].product.name).toBe("Autumn Vibes")  
      expect(res.body.item[1].product.description).toBe("This is a autumn sticker sheet")
      expect(res.body.item[1].price).toBe(15)
      expect(res.body.item[1].quantity).toBe(25)    
    })

    test("Add product to the cart with invalid cartid", async () => {
      const res = await request(app).post('/carts/63d35c8f2c13144a29ec899a/Autumn Vibes').send({
        quantity: 15
      })
      expect(res.status).toBe(404)
      expect(res.headers['content-type']).toMatch(/json/i)
      expect(res.body).toEqual({"error": "Cart Item not found!"})
    })

    test("Add product to the cart without cartid", async () => {
      const res = await request(app).post('/carts/null/R U OK').send({
        quantity: 15
      })
      expect(res.status).toBe(201)
      expect(res.headers['content-type']).toMatch(/json/i)
      expect(res.body._id).toBeDefined()
      expect(res.body.item[0].product.name).toBe("R U OK") 
      expect(res.body.item[0].product.description).toBe("This is a sticker flakes")
      expect(res.body.item[0].price).toBe(10)
      expect(res.body.item[0].quantity).toBe(15)
    })

    test("Add product to the cart with invalid product name", async () => {
      const res = await request(app).post('/carts/null/R U OKA').send({
        quantity: 15
      })
      expect(res.status).toBe(404)
      expect(res.headers['content-type']).toMatch(/json/i)
      expect(res.body).toEqual({"error": "Product not found!"})
    })

    test("Update product quantity to the cart with valid id", async () => {
      const res = await request(app).post('/carts/63d35c8f2c13144a29ec869d/Autumn Vibes').send({
        quantity: 10
      })
      expect(res.status).toBe(201)
      expect(res.headers['content-type']).toMatch(/json/i)
      expect(res.body._id).toBeDefined()
      expect(res.body.item[0].product.name).toBe("Autumn Vibes") 
      expect(res.body.item[0].product.description).toBe("This is a autumn sticker sheet")
      expect(res.body.item[0].price).toBe(15)
      expect(res.body.item[0].quantity).toBe(25)
    })

    test("Update product quantity to the cart with invalid cartid", async () => {
      const res = await request(app).post('/carts/63d35c8f2d13144a29ec869d/Autumn Vibes').send({
        quantity: 10
      })
      expect(res.status).toBe(404)
      expect(res.headers['content-type']).toMatch(/json/i)
      expect(res.body).toEqual({"error": "Cart Item not found!"})
    })

    test("Update product quantity to the cart with invalid product name", async () => {
      const res = await request(app).post('/carts/63d35c8f2c13144a29ec869d/Autumn and Spring Vibes').send({
        quantity: 10
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
          expect(el.cart.item).toBeDefined()
        }) 
      })
      
      // Test the value of the data returned
      it('Has an element with the correct data value', () => {
        expect(res.body[0].cart.item[0].product).toBe("63d35c8f2c13144a29ec8697") 
        expect(res.body[0].cart.item[0].price).toBe(10)
        expect(res.body[0].cart.item[0].quantity).toBe(1)
        expect(res.body[0].cart.item[1].product).toBe("63d35c8f2c13144a29ec8698")  
        expect(res.body[0].cart.item[1].price).toBe(15)
        expect(res.body[0].cart.item[1].quantity).toBe(10)
        expect(res.body[0].total).toBe(160)
        expect(res.body[0].address.email).toBe("12345@gmail.com")
        expect(res.body[0].cart.item[0].product).toBe("63d35c8f2c13144a29ec8698") 
        expect(res.body[0].cart.item[0].price).toBe(15)
        expect(res.body[0].cart.item[0].quantity).toBe(20)})
    }) 

    // Test to get a single order
    describe("GET a single product with valid orderid", () => {
      let res
      // Define the route and http method
      beforeEach(async () => {
        res = await request(app).get('/orders/63d35c902c13144a29ec86a3')
        expect(res.statusCode).toBe(200)
        expect(res.headers['content-type']).toMatch(/json/i)      
      })
      // Test the value of the data returned
      it('Has an element with the correct data value', () => {
        expect(res.body.cart.item[0].product).toBe("63d35c8f2c13144a29ec8697") 
        expect(res.body.cart.item[0].price).toBe(10)
        expect(res.body.total).toBe(160)
        expect(res.body.address._id).toBe("63d35c902c13144a29ec86a0")
      })
      // Test the data structure of the data returned
      it('Has an element with the correct data structure', () => {
          expect(res.body._id).toBeDefined()
          expect(res.body.cart.item).toBeDefined()
          expect(res.body.cart.item[0].product).toBeDefined()
          expect(res.body.cart.item[0].price).toBeDefined()
          expect(res.body._id.length).toBe(24)
          expect(res.body.total).toBeDefined()
          expect(res.body.address).toBeDefined()
      })
    })

    test("GET a single product with invalid orderid", async () => {
      // Define the route and http method
      const res = await request(app).get('/orders/63d36c902c13144a29ec86a3')
        expect(res.statusCode).toBe(404)
        expect(res.headers['content-type']).toMatch(/json/i)     
        expect(res.body).toEqual({"error": "Order not found!"})

    })
})

