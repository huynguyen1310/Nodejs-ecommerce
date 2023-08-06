'use strict'

const { createTokenPair, verifyJwt } = require('../auth/authUtils')
const shopModel = require('../models/shop.model')
const KeyTokenService = require('./keyToken.service')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const { getInfoData } = require('../utils/index')
const { BadRequestError, AuthFailureError, ForBiddenError } = require('../core/error.response')
const { findByEmail } = require('../services/shop.service')
const keytokenModel = require('../models/keytoken.model')

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static handlerRefreshToken = async (refreshToken) => {

    // check if token is used
    const usedToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)

    if (usedToken) {
      //decode token
      const { userId, email } = await verifyJwt(refreshToken, usedToken.privateKey)
      // delete all token in keyStore
      await KeyTokenService.deleteKeyById(userId)
      throw new ForBiddenError('Something went wrong!!! pls relogin')
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    if (!holderToken) throw new AuthFailureError('Shop not registered')

    //verify token
    const { userId, email } = await verifyJwt(refreshToken, holderToken.privateKey)

    //check userId
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Shop not registered')

    //creat new pairs of tokens
    const tokens = await createTokenPair({ userId: foundShop._id, email }, holderToken.publicKey, holderToken.privateKey)

    //update Token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })

    return {
      user: { userId, email },
      tokens
    }
  }

  static logout = async (keyStore) => {
    await KeyTokenService.removeKeyById(keyStore._id)
  }

  static login = async ({ email, password, refreshToken = null }) => {
    const shop = await findByEmail({ email })
    if (!shop) throw new BadRequestError('Shop not registered')

    const match = bcrypt.compare(password, shop.password)
    if (!match) throw new AuthFailureError('Authentication error')

    const publicKey = crypto.randomBytes(64).toString('hex')
    const privateKey = crypto.randomBytes(64).toString('hex')

    const tokens = await createTokenPair({ userId: shop._id, email }, publicKey, privateKey)

    await KeyTokenService.createToken({
      userId: shop._id,
      refreshToken: tokens.refreshToken,
      privateKey, publicKey
    })

    return {
      shop: getInfoData({
        fields: ['_id', 'name', 'email'], object: shop
      }),
      tokens
    }

  }



  static signUp = async ({ name, email, password }) => {
    try {

      const holderShop = await shopModel.findOne({ email }).lean()

      if (holderShop) {
        throw new BadRequestError('Error: Shop already registered')
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const shop = await shopModel.create({
        name, email, password: hashedPassword, roles: [RoleShop.SHOP]
      })

      if (shop) {
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const keyStore = await KeyTokenService.createToken({
          user: shop._id,
          publicKey,
          privateKey
        })

        if (!keyStore) {
          return {
            code: '400',
            message: 'Invalid token'
          }
        }

        const tokens = await createTokenPair({ userId: shop._id, email }, publicKey, privateKey)
        console.log(tokens)

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
