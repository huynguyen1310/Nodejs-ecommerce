'use strict'

const { SuccessResponse } = require('../core/success.response')
const CheckoutService = require('../services/checkout.service')


class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Cart success',
      metadata: await CheckoutService.checkOutReview(req.body)
    }).send(res)
  }
}

module.exports = new CheckoutController()

