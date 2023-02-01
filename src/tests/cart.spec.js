import { ProductModel, CartModel } from '../db.js'
import { checkProduct, checkCart } from '../controllers/cart_controller.js' 
import {jest} from '@jest/globals'

// Unit Test checkProduct function
describe('Check whether a product exists', () => {
  it('Should return Product not found', async () => {
    ProductModel.findOne = jest.fn().mockImplementation(() => {
      return { name: 'R U OK', id: 'fake_id', price: 10, imageLinks: 'M' }
  })

    ProductModel.prototype.save = jest.fn().mockImplementation(() => {})

    await expect(checkProduct('R U OK', 10)).resolves.toEqual({"price": 10, "product": "R U OK", "quantity": 10, imageLinks: 'M'})
    })
})

// Unit Test checkCart function
describe('Check whether a cart exists', () => {
  it('Should return Cart Item not found', async () => {
    CartModel.findById = jest.fn().mockImplementation(() => {
      return { id: 'fake_id'}
  })

    CartModel.prototype.save = jest.fn().mockImplementation(() => {})

    await expect(checkCart('fake_id')).resolves.toEqual({id:'fake_id'})
    })
})

// Unit Test updateCart function
describe('Update Cart', () => {
  const mockUrl = '/carts/63d79b36be7fa03f924bbb36/R U OK';
  const request = { quantity: 20 }
  const originalCart = {
    "_id": "63d79b36be7fa03f924bbb36",
    "item": [
        {
            "product": "R U OK",
            "imageLinks": "https://i.postimg.cc/7Cgg0Tjt/RUOK1.jpg",
            "price": 10,
            "quantity": 1,
            "_id": "63d79b36be7fa03f924bbb37"
        }
    ],
    "__v": 0
};
  const mockCart = originalCart
  mockCart.item[0].quantity =  request.quantity

  const updateCart = jest.fn(mockUrl => mockCart);
  it('returns the updated quantity', () => {
    expect(updateCart(mockUrl).item[0].quantity).toBe(20);
  });
  it('called updateCart with a mockUrl', () => {
    expect(updateCart).toHaveBeenCalledWith(mockUrl);
  });
});

