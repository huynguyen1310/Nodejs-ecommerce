'use strict'

const { Types, models } = require('mongoose')
const { product, clothing, electronic, furniture } = require('../product.model')
const { getSelecteData, unGetSelecteData, convertToObjectIdMongodb } = require('../../utils')

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const findAllProduct = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit
  const sortBy = sort == 'ctime' ? { _id: -1 } : { _id: 1 }
  const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelecteData(select))
    .lean()

  return products
}

const findProduct = async ({ product_id, unselect }) => {
  return await product.findById(new Types.ObjectId(product_id))
    .select(unGetSelecteData(unselect))
}


const searchProductByShop = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch)
  const results = await product.find({
    isDraft: false,
    isPublished: true,
    $text: { $search: regexSearch }
  },
    { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .lean()

  return results
}

const publishProductByShop = async ({ product_shop, product_id }) => {
  const shop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: product_id
  })

  if (!shop) return null

  shop.isDraft = false
  shop.isPublished = true
  shop.save()

  return shop
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const shop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: product_id
  })

  if (!shop) return null

  shop.isDraft = true
  shop.isPublished = false
  shop.save()

  return shop
}

const queryProduct = async ({ query, limit, skip }) => {
  return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const getProductById = async (productId) => {
  return await product.findOne({ _id: convertToObjectIdMongodb(productId) }).lean()
}

const updateProductById = async ({ productId, bodyUpdate, model, isNew = true }) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew
  })
}

const checkProductByServer = async (products) => {
  return await Promise.all(products.map(async product => {
    const foundProduct = await getProductById(product.productId)
    if (foundProduct) {
      return {
        price: foundProduct.product_price,
        quantity: foundProduct.product_quantity,
        productId: product.productId
      }
    }
  }))
}

module.exports = {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByShop,
  findAllProduct,
  findProduct,
  updateProductById,
  getProductById,
  checkProductByServer
}
