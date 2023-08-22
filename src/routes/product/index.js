'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller.js')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/authUtils')

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProducts))
router.get('', asyncHandler(productController.getListProducts))
router.get('/:id', asyncHandler(productController.getProduct))

// Authenticate
router.use(authenticationV2)

router.post('', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProduct))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct))

router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop))
router.get('/publisheds/all', asyncHandler(productController.getAllPublishForShop))

module.exports = router
