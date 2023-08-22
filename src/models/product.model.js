'use strict'

const { Schema, model, Types } = require('mongoose')
const slugify = require('slugify')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
  product_name: { type: 'string', required: true },
  product_thumb: { type: 'string', required: true },
  product_description: { type: 'string' },
  product_slug: { type: 'string' },
  product_price: { type: 'string', required: true },
  product_quantity: { type: 'string', required: true },
  product_type: { type: 'string', required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  product_attributes: { type: Schema.Types.Mixed, required: true },
  product_ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val) => Math.round(val * 10) / 10
  },
  product_variations: { type: Array, default: [] },
  isDraft: { type: Boolean, default: true, index: true, select: false },
  isPublished: { type: Boolean, default: false, index: true, select: false }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

//Create index for Search
productSchema.index({ product_name: 'text', product_description: 'text' })


productSchema.pre('save', function(next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})

const clothingSchema = new Schema({
  brand: { type: 'string', required: true },
  size: String,
  material: String,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
  timeseries: true,
  collection: 'clothes'
})

const electronicSchema = new Schema({
  manufacturer: { type: 'string', required: true },
  model: String,
  color: String,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
  timeseries: true,
  collection: 'electronics'

})

const furnitureSchema = new Schema({
  brand: { type: 'string', required: true },
  size: String,
  material: String,
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
  timeseries: true,
  collection: 'furnitures'

})

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  electronic: model('Electronics', electronicSchema),
  clothing: model('Clothing', clothingSchema),
  furniture: model('Furniture', furnitureSchema)
}

