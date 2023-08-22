'use strict'

const { getProductById } = require('../models/repositories/product.repo')
const { BadRequestError } = require('../core/error.response')
const inventoryModel = require('../models/inventory.model')

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = '111 tran phu'
  }) {
    const product = await getProductById(productId)
    if (!product) throw new BadRequestError('The product does not exists')

    const query = { inven_shopId: shopId, inven_productId: productId },
      updateSet = {
        $inc: {
          inven_stock: stock
        },
        $set: {
          inven_location: location
        }
      }, options = { upsert: true, new: true }

    return await inventoryModel.findOneAndUpdate(query, updateSet, options)
  }

  static async getOrdersByUser() { }

  static async getOneOrdersByUser() { }

  static async cancelOrdersByUser() { }

  static async updateOrdersStatusByShop() { }
}

module.exports = InventoryService
