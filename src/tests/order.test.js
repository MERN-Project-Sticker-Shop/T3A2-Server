import app from '../app.js'
import request from 'supertest'
import { databaseConnector, databaseDisconnector } from '../mongooseConnector.js'
import { cartId1 } from './cart.test.js'
import dotenv from 'dotenv'

dotenv.config()  
let orderId
let addressId

// establish a connection to the database 
const DATABASE_URI = process.env.ATLAS_DB_URL_TEST
// set up before-tests and after-tests operations
beforeAll(async () => {
    await databaseConnector(DATABASE_URI);
});

afterAll(async () => {
    await databaseDisconnector();
});

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
      expect(res.body[0].cart.items[0].price).toBe(3)
      expect(res.body[0].cart.items[0].quantity).toBe(1)
      expect(res.body[0].total).toBe(160)
      expect(res.body[0].address.email).toBe("12345@gmail.com")
      expect(res.body[1].cart.items[0].product).toBe('Autumn Vibes') 
      expect(res.body[1].cart.items[0].price).toBe(6)
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
      expect(res.body.cart.items[0].price).toBe(3)
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