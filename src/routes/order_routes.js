import express from 'express'
import { OrderModel } from '../db.js'

const router = express.Router()

//Get all products
router.get('', async (req, res) => {
  res.send(await OrderModel.find().populate('cart'))
})

export default router