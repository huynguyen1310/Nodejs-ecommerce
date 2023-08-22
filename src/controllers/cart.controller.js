'use strict'

const CartService = require('../services/cart.service.js')
const { SuccessResponse } = require('../core/success.response')

class CartController {
  addtoCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Cart success',
      metadata: await CartService.addToCart(req.body)
    }).send(res)
  }

  update = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Cart success',
      metadata: await CartService.addToCartV2(req.body)
    }).send(res)
  }

  delete = async (req, res, next) => {
    new SuccessResponse({
      message: 'delete Cart success',
      metadata: await CartService.deleteUserCart(req.body)
    }).send(res)
  }

  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'List Cart success',
      metadata: await CartService.getListUserCart({ userId: req.query.userId })
    }).send(res)
  }
}

module.exports = new CartController()
