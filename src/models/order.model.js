'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new Schema({
  order_userId: { type: Number, required: true },
  order_checkout: { type: Object, default: {} },
  order_shipping: { type: Object, default: {} },
  order_payment: { type: Object, default: {} },
  order_products: { type: Array, require: [] },
  order_trackingNumber: { type: String, default: '#000011' },
  order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending' }
}, {
  collection: COLLECTION_NAME,
  timestamps: {
    createdAt: 'createdOn',
    updatedAt: 'updatedOn'
  }
})

module.exports = model(DOCUMENT_NAME, orderSchema)
