import app from '../app.js'
import request from 'supertest'

let productId1
let productId2


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
})
