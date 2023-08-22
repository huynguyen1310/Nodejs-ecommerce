'use strict'

const cartModel = require('../models/cart.model')
const { NotFoundError } = require('../core/error.response')
const { getProductById } = require('../models/repositories/product.repo')

class CartService {
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateOrInsert = {
        $addToSet: {
          cart_products: product
        }
      }, options = { upsert: true, new: true }

    return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product
    const query = {
      cart_userId: userId,
      'cart_products.productId': productId,
      cart_state: 'active'
    }, updateSet = {
      $inc: {
        'cart_products.$.quantity': quantity
      }
    }, options = { upsert: true, new: true }

    return await cartModel.findOneAndUpdate(query, updateSet, options)
  }


  static async addToCart({ userId, product = {} }) {
    const userCart = await cartModel.findOne({
      cart_userId: userId
    })

    if (!userCart) {
      return await this.createUserCart({ userId, product })
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product]
      return await userCart.save()
    }

    return await this.updateUserCartQuantity({ userId, product })
  }

  static async addToCartV2({ userId, shop_order_ids }) {
    console.log(shop_order_ids[0])
    const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]

    const foundProduct = await getProductById(productId)
    if (!foundProduct) throw new NotFoundError('')

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError('PRoduct to not belong to the shop')
    }

    if (quantity === 0) {

    }

    return await this.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity
      }
    })
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateSet = {
        $pull: {
          cart_products: {
            productId
          }
        }
      }

    const deleteCart = await cartModel.updateOne(query, updateSet)
    return deleteCart
  }

  static async getListUserCart({ userId }) {
    return await cartModel.findOne({
      cart_userId: +userId
    }).lean()
  }
}

module.exports = CartService
