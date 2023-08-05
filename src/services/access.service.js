'use strict'

const { createTokenPair } = require('../auth/authUtils')
const shopModel = require('../models/shop.model')
const KeyTokenService = require('./keyToken.service')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const { getInfoData } = require('../utils/index')
const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {

      const holderShop = await shopModel.findOne({ email }).lean()

      if (holderShop) {
        return {
          code: '400',
          message: 'Shop already exists'
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const shop = await shopModel.create({
        name, email, password: hashedPassword, roles: [RoleShop.SHOP]
      })

      if (shop) {
        // create public key and private key for asymmetric
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
          }
        })

        const publicKeyString = await KeyTokenService.createToken({
          user: shop._id,
          publicKey
        })

        if (!publicKeyString) {
          return {
            code: '400',
            message: 'Invalid token'
          }
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString)
        const tokens = await createTokenPair({ userId: shop._id, email }, publicKeyObject, privateKey)
        console.log('create token success' + tokens)

        return {
          code: 201,
          metadata: {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: shop }),
            tokens
          }
        }
      }

      return {
        code: 200,
        metadata: null
      }



    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }

}

module.exports = AccessService
