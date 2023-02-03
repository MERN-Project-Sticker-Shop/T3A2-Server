import app from '../app.js'
import request from 'supertest'
import { databaseConnector, databaseDisconnector } from '../mongooseConnector.js'
import dotenv from 'dotenv'

dotenv.config()  


// establish a connection to the database 
const DATABASE_URI = process.env.ATLAS_DB_URL_TEST
// set up before-tests and after-tests operations
beforeAll(async () => {
    await databaseConnector(DATABASE_URI);
});

afterAll(async () => {
    await databaseDisconnector();
});


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
        expect(res.body[0].price).toBe(3)
        expect(res.body[1].name).toBe("Autumn Vibes")
        expect(res.body[1].price).toBe(6)
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
      expect(res.body.price).toBe(3)
      expect(res.body.description).toBe('Perfect for Laptop, ipad, Phone, Bullet Journal, Scrapbook, any smooth and flat surface! ' +
      'The size of the sticker flake is approximately 5.5cm x 6cm (2.17 inches x 2.36 inches), and the material ' + 
      'is glossy water resistant laminate.To increase the lifespan of our stickers, ' + 
      'please do not submerge it in water for long periods of time or subject it to hard scrubbing.')
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
})
