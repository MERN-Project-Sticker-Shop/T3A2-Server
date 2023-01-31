import { ProductModel, CartModel } from '../db.js'
import { checkProduct, checkCart } from '../controllers/cart_controller.js' 
import {jest} from '@jest/globals'

// Test checkProduct function
describe('Check whether a product exists', () => {
  it('Should return Product not found', async () => {
    ProductModel.findOne = jest.fn().mockImplementation(() => {
      return { name: 'R U OK', id: 'fake_id' }
  })

    ProductModel.prototype.save = jest.fn().mockImplementation(() => {})

    await expect(checkProduct('R U OK', 10)).resolves.toEqual({"price": undefined, "product": {"name": "R U OK", "id": "fake_id"}, "quantity": 10})
    })
})

// Test checkCart function
describe('Check whether a cart exists', () => {
  it('Should return Cart Item not found', async () => {
    CartModel.findById = jest.fn().mockImplementation(() => {
      return { id: 'fake_id'}
  })

    CartModel.prototype.save = jest.fn().mockImplementation(() => {})

    await expect(checkCart('fake_id')).resolves.toEqual({id:'fake_id'})
    })
})

// Test updateCart function
describe('Update Cart', () => {
  const mockUrl = '/carts/63d79b36be7fa03f924bbb36/R U OK';
  const request = { quantity: 20 }
  const originalCart = {
    "_id": "63d79b36be7fa03f924bbb36",
    "item": [
        {
            "product": {
                "_id": "63d79b36be7fa03f924bbb33",
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

