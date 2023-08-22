const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.service.v2.js')
const { SuccessResponse } = require('../core/success.response')

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create Product success',
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Product success',
      metadata: await ProductServiceV2.updateProduct(req.body.product_type, req.params.productId, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  publishProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Publish Product success',
      metadata: await ProductServiceV2.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id
      })
    }).send(res)
  }

  unPublishProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'UnPublish Product success',
      metadata: await ProductServiceV2.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id
      })
    }).send(res)
  }


  getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get List success',
      metadata: await ProductServiceV2.findAllDraftForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get List success',
      metadata: await ProductServiceV2.findAllPublishForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getListSearchProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get List success',
      metadata: await ProductServiceV2.searchProduct(req.params)
    }).send(res)
  }

  getListProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get List success',
      metadata: await ProductServiceV2.findAllProduct(req.query)
    }).send(res)
  }

  getProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get product success',
      metadata: await ProductServiceV2.findProduct({
        product_id: req.params.id
      })
    }).send(res)
  }

}

module.exports = new ProductController()
