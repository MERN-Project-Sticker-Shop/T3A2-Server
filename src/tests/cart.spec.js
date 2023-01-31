import { ProductModel, CartModel } from '../db.js'
import { checkProduct, checkCart, updateCart } from '../controllers/cart.js' 
import {jest} from '@jest/globals'

describe('Check whether a product exists', () => {
  it('Should return Product not found', async () => {
    ProductModel.findOne = jest.fn().mockImplementation(() => {
      return { name: 'R U OK' }
  })

    ProductModel.prototype.save = jest.fn().mockImplementation(() => {})

    await expect(checkProduct('R U OK', 10)).resolves.toEqual({"price": undefined, "product": {"name": "R U OK"}, "quantity": 10})
    })
})

describe('Check whether a cart exists', () => {
  it('Should return Cart Item not found', async () => {
    CartModel.findById = jest.fn().mockImplementation(() => {
      return { id: 'fake_id'}
  })

    CartModel.prototype.save = jest.fn().mockImplementation(() => {})

    await expect(checkCart('fake_id')).resolves.toEqual({id:'fake_id'})
    })
})




// describe('Get a single cart', () => {
//   const mockUrl = '/carts/carts/63d79b36be7fa03f924bbb36';
//   const mockCart = [{
//     "_id": "63d79b36be7fa03f924bbb36",
//     "item": [
//         {
//             "product": {
//                 "_id": "63d79b36be7fa03f924bbb33",
//                 "name": "R U OK",
//                 "description": "This is a sticker flakes",
//                 "imageLinks": [
//                     "https://ibb.co/7vdXTsW",
//                     "https://ibb.co/DWTW5tV",
//                     "https://ibb.co/XJpPqPT"
//                 ]
//             },
//             "price": 10,
//             "quantity": 1,
//             "_id": "63d79b36be7fa03f924bbb37"
//         }
//     ],
//     "__v": 0
// }];
//   const getCart = jest.fn(url => mockCart);
//   it('returns users from an api call', () => {
//     expect(getCart(mockUrl)).toBe(mockCart);
//     console.log(getCart);
//   });
//   it('called getcART with a mockUrl', () => {
//     expect(getCart).toHaveBeenCalledWith(mockUrl);
//   });
// });