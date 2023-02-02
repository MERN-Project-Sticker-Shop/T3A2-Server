import app from '../app.js'
import request from 'supertest'

let cartId1
let cartId2
let newCartId


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
      expect(res.body[0].items[0].imageLink).toBe("https://i.postimg.cc/Sxyck0pm/84c3983c010dcf1eb814972e8c66111.jpg")
      expect(res.body[0].items[1].product).toBe("Autumn Vibes")
      expect(res.body[0].items[1].quantity).toBe(10)   
      expect(res.body[0].items[1].imageLink).toBe("https://i.postimg.cc/Pf0kghY8/a9631135138ebca99bef8ade1982662.jpg")
      expect(res.body[1].items[0].product).toBe("Autumn Vibes")
      expect(res.body[1].items[0].quantity).toBe(20)
      expect(res.body[0].items[1].imageLink).toBe("https://i.postimg.cc/Pf0kghY8/a9631135138ebca99bef8ade1982662.jpg")
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
      expect(res.body.items[0].imageLink).toBe("https://i.postimg.cc/Sxyck0pm/84c3983c010dcf1eb814972e8c66111.jpg")
      expect(res.body.items[1].product).toBe("Autumn Vibes")
      expect(res.body.items[1].quantity).toBe(10)     
      expect(res.body.items[1].imageLink).toBe("https://i.postimg.cc/Pf0kghY8/a9631135138ebca99bef8ade1982662.jpg")
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
    expect(res.body.items[0].imageLink).toBe("https://i.postimg.cc/Sxyck0pm/84c3983c010dcf1eb814972e8c66111.jpg") 
    expect(res.body.items[0].price).toBe(3)
    expect(res.body.items[0].quantity).toBe(1)
    expect(res.body.items[1].product).toBe("Autumn Vibes")  
    expect(res.body.items[1].price).toBe(6)
    expect(res.body.items[1].quantity).toBe(30)    
    expect(res.body.items[1].imageLink).toBe("https://i.postimg.cc/Pf0kghY8/a9631135138ebca99bef8ade1982662.jpg")
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
    expect(res.body.items[0].price).toBe(6)
    expect(res.body.items[0].quantity).toBe(20)  
    expect(res.body.items[0].imageLink).toBe("https://i.postimg.cc/Pf0kghY8/a9631135138ebca99bef8ade1982662.jpg")
    expect(res.body.items[1].product).toBe("R U OK") 
    expect(res.body.items[1].price).toBe(3)
    expect(res.body.items[1].quantity).toBe(30)  
    expect(res.body.items[1].imageLink).toBe("https://i.postimg.cc/Sxyck0pm/84c3983c010dcf1eb814972e8c66111.jpg") 
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
    expect(res.body.items[0].price).toBe(3)
    expect(res.body.items[0].quantity).toBe(15)
    expect(res.body.items[0].imageLink).toBe("https://i.postimg.cc/Sxyck0pm/84c3983c010dcf1eb814972e8c66111.jpg") 
    newCartId = res.body._id
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

    // Test to delete a cart item
    test("Delete a product in the cart with valid cartid", async () => {
      const res = await request(app).delete(`/carts/${cartId1}/Autumn Vibes`)
      expect(res.status).toBe(200)
      expect(res.headers['content-type']).toMatch(/json/i)
      expect(res.body._id).toBeDefined()
      expect(res.body.items[0].product).toBe("R U OK") 
      expect(res.body.items[0].price).toBe(3)
      expect(res.body.items[0].quantity).toBe(1)
      expect(res.body.items[0].imageLink).toBe("https://i.postimg.cc/Sxyck0pm/84c3983c010dcf1eb814972e8c66111.jpg")
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
      const res = await request(app).delete(`/carts/${newCartId}`)
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

export { cartId1, cartId2, newCartId }