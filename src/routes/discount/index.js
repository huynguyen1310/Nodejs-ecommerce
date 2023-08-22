'use strict'

const express = require('express')
const router = express.Router()
const DiscountController = require('../../controllers/discount.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

router.post('/amount', asyncHandler(DiscountController.getDiscountAmount))
router.get('/list-product-code', asyncHandler(DiscountController.getAllDiscountCodeWithProducts))

router.use(authenticationV2)

router.post('', asyncHandler(DiscountController.createDiscountCode))
router.get('', asyncHandler(DiscountController.getAllDiscountCodes))

module.exports = router
