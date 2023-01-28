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
      expect(res.body).toEqual(
      [
        {
            "_id": "63d479f8b4c1cb86f6d30b88",
            "name": "R U OK",
            "price": 10,
            "description": "This is a sticker flakes",
            "imageLinks": [
                "https://ibb.co/7vdXTsW",
                "https://ibb.co/DWTW5tV",
                "https://ibb.co/XJpPqPT"
            ],
            "__v": 0
        },
        {
            "_id": "63d479f8b4c1cb86f6d30b89",
            "name": "Autumn Vibes",
            "price": 15,
            "description": "This is a autumn sticker sheet",
            "imageLinks": [
                "https://ibb.co/yNBcb0k",
                "https://ibb.co/3WS3g9G",
                "https://ibb.co/ymTVQ9m"
            ],
            "__v": 0
        }
      ])
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
        expect(res.body[0]).toEqual(
            {
              "_id": "63d479f9b4c1cb86f6d30b8b",
              "item": [
                  {
                      "product": {
                          "_id": "63d479f8b4c1cb86f6d30b88",
                          "name": "R U OK",
                          "description": "This is a sticker flakes",
                          "imageLinks": [
                              "https://ibb.co/7vdXTsW",
                              "https://ibb.co/DWTW5tV",
                              "https://ibb.co/XJpPqPT"
                          ]
                      },
                      "price": 10,
                      "quantity": 1,
                      "_id": "63d479f9b4c1cb86f6d30b8c"
                  },
                  {
                      "product": {
                          "_id": "63d479f8b4c1cb86f6d30b89",
                          "name": "Autumn Vibes",
                          "description": "This is a autumn sticker sheet",
                          "imageLinks": [
                              "https://ibb.co/yNBcb0k",
                              "https://ibb.co/3WS3g9G",
                              "https://ibb.co/ymTVQ9m"
                          ]
                      },
                      "price": 15,
                      "quantity": 10,
                      "_id": "63d479f9b4c1cb86f6d30b8d"
                  }
              ],
              "__v": 0
          })
        expect(res.body[1]).toEqual(
          {
            "_id": "63d479f9b4c1cb86f6d30b8e",
            "item": [
                {
                    "product": {
                        "_id": "63d479f8b4c1cb86f6d30b89",
                        "name": "Autumn Vibes",
                        "description": "This is a autumn sticker sheet",
                        "imageLinks": [
                            "https://ibb.co/yNBcb0k",
                            "https://ibb.co/3WS3g9G",
                            "https://ibb.co/ymTVQ9m"
                        ]
                    },
                    "price": 15,
                    "quantity": 20,
                    "_id": "63d479f9b4c1cb86f6d30b8f"
                }
            ],
            "__v": 0
          })
      })
    }) 

    // Test the cart routes to get a single cart
    describe("GET a single cart", () => {
        let res
  
        // Define the route and http method
        beforeEach(async () => {   
          res = await request(app).get('/carts/63d479f9b4c1cb86f6d30b8b')
          expect(res.statusCode).toBe(200)
          expect(res.headers['content-type']).toMatch(/json/i)
          })
    
        // Test the number of elements in the array
        it('Should return an array of 1 elements', () => {        
          expect(res.body).toBeInstanceOf(Object)
          expect(res.body.length).toBe(1)
        })
  
        // Test the data structure of the data returned  
        it('Has an element with the correct data structure', () => {
          res.body.forEach(el => {
            expect(res.body._id).toBeDefined()
            expect(res.body.item).toBeDefined()
            expect(res.body.item.product).toBeDefined()
            expect(res.body.item.price).toBeDefined()
            expect(res.body.item.quantity).toBeDefined()
            expect(res.body.item._id).toBeDefined()
          })
        })
    
        // Test the value of the data returned
        it('Has an element with the correct data value', () => {
          expect(res.body).toEqual(
            {
              "_id": "63d479f9b4c1cb86f6d30b8b",
              "item": [
                  {
                      "product": {
                          "_id": "63d479f8b4c1cb86f6d30b88",
                          "name": "R U OK",
                          "description": "This is a sticker flakes",
                          "imageLinks": [
                              "https://ibb.co/7vdXTsW",
                              "https://ibb.co/DWTW5tV",
                              "https://ibb.co/XJpPqPT"
                          ]
                      },
                      "price": 10,
                      "quantity": 1,
                      "_id": "63d479f9b4c1cb86f6d30b8c"
                  },
                  {
                      "product": {
                          "_id": "63d479f8b4c1cb86f6d30b89",
                          "name": "Autumn Vibes",
                          "description": "This is a autumn sticker sheet",
                          "imageLinks": [
                              "https://ibb.co/yNBcb0k",
                              "https://ibb.co/3WS3g9G",
                              "https://ibb.co/ymTVQ9m"
                          ]
                      },
                      "price": 15,
                      "quantity": 10,
                      "_id": "63d479f9b4c1cb86f6d30b8d"
                  }
              ],
              "__v": 0
            })
      }) 
    })
    
  // Test to view a single cart with invalid cartid
    test('GET a single cart with invalid cartid', async () => {
      const res = await request(app).get('/carts/63d479f9b4c1cb86f6d30b8b')
      expect(res.statusCode).toBe(404)
      expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
      expect(res.body).toEqual({"error": "Cart Item not found!"})
    })

    // Test the route to add product to the cart with valid cartid
    test("Add product to the cart with valid cartid", async () => {
      const res = await request(app).post('/carts/63d479f9b4c1cb86f6d30b8b/Autumn Vibes').send({
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
      expect(res.body.item[0].product.name).toBe("R U OK") 
      expect(res.body.item[0].product.description).toBe("This is a sticker flakes")
      expect(res.body.item[0].price).toBe(10)
      expect(res.body.item[0].quantity).toBe(15)
    })

    // Test the route to add product to the cart with invalid product name
    test("Add product to the cart with invalid product name", async () => {
      const res = await request(app).post('/carts/63d479f9b4c1cb86f6d30b8b/R U OKA').send({
        quantity: 15
      })
      expect(res.status).toBe(404)
      expect(res.headers['content-type']).toMatch(/json/i)
      expect(res.body).toEqual({"error": "Product not found!"})
    })

    // Test the route to update product quantity in the cart with valid cartid
    test("Update product quantity to the cart with valid id", async () => {
      const res = await request(app).patch('/carts/63d479f9b4c1cb86f6d30b8e/Autumn Vibes').send({
        quantity: 10
      })
      expect(res.status).toBe(201)
      expect(res.headers['content-type']).toMatch(/json/i)
      expect(res.body._id).toBeDefined()
      expect(res.body.item[0].product.name).toBe("Autumn Vibes") 
      expect(res.body.item[0].product.description).toBe("This is a autumn sticker sheet")
      expect(res.body.item[0].price).toBe(15)
      expect(res.body.item[0].quantity).toBe(30)
    })

    // Test the route to update product quantity in the cart with invalid cartid
    test("Update product quantity to the cart with invalid cartid", async () => {
      const res = await request(app).patch('/carts/63d35c8f2d13144a29ec869d/Autumn Vibes').send({
        quantity: 10
      })
      expect(res.status).toBe(404)
      expect(res.headers['content-type']).toMatch(/json/i)
      expect(res.body).toEqual({"error": "Cart Item not found!"})
    })

    // Test the route to update product quantity in the cart with invalid product name
    test("Update product quantity to the cart with invalid product name", async () => {
      const res = await request(app).patch('/carts/63d479f9b4c1cb86f6d30b8e/Autumn and Spring Vibes').send({
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
        expect(res.body[0].cart.item[0].quantity).toBe(20)
      })
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
    })

    test("Add new orders with valid id", async () => {
      const res = await request(app).post('/orders').send({
        "addressId":"63d45d962acdcc5d6564f7f0",
        "total": 500,
        "cartId": "63d3b9997ef8672097ade9a0"
      })
      expect(res.status).toBe(201)
      expect(res.headers['content-type']).toMatch(/json/i)
      expect(res.body._id).toBeDefined()
      expect(res.body.cart.item[0].product).toBe("63d35c8f2c13144a29ec8697") 
      expect(res.body.cart._id).toBe("63d3b9997ef8672097ade9a0") 
      expect(res.body.total).toBe(500)
      expect(res.body.address._id).toBe("63d45d962acdcc5d6564f7f0")
    })

    test("Add new orders with invalid address id", async () => {
      const res = await request(app).post('/orders').send({
        "addressId":"63d45d962acdcc5d6510f7f0",
        "total": 500,
        "cartId": "63d3b9997ef8672097ade9a0"
      })
      expect(res.status).toBe(404)
      expect(res.headers['content-type']).toMatch(/json/i)
      expect(res.body).toEqual({"error": "Address not found!"})
    })

    test("Add new orders with invalid address id", async () => {
      const res = await request(app).post('/orders').send({
        "addressId":"63d45d962acdcc5d6564f7f0",
        "total": 500,
        "cartId": "63d3b9997ef8672097aff9a0"
      })
      expect(res.status).toBe(404)
      expect(res.headers['content-type']).toMatch(/json/i)
      expect(res.body).toEqual({"error": "Cart not found!"})
    })

})
