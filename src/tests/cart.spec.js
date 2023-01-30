import { getAllCart, getSingleCart, addProduct, updateProduct, deleteProduct, deleteCart } from '../controllers/cart.js'

import {jest} from '@jest/globals'

describe('Get a single cart', () => {
  const mockUrl = '/carts/carts/63d79b36be7fa03f924bbb36';
  const mockCart = [{
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
}];
  const getCart = jest.fn(url => mockCart);
  it('returns users from an api call', () => {
    expect(getCart(mockUrl)).toBe(mockCart);
    console.log(getCart);
  });
  it('called getcART with a mockUrl', () => {
    expect(getCart).toHaveBeenCalledWith(mockUrl);
  });
});