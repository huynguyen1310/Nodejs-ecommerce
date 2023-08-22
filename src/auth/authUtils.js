'use strict'
const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'x-rtoken-key'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: '2 days'
    })

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: '7 days'
    })

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error('error verify', err)
      } else {
        console.log('decode verify', decode)
      }
    })

    return { accessToken, refreshToken }

  } catch (error) {
    return error

  }

}

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invaild request')

  const keyToken = await findByUserId(userId)
  if (!keyToken) throw new NotFoundError('Not found keytoken')

  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailureError('Invaild request')

  try {
    const decodeUser = JWT.verify(accessToken, keyToken.publicKey)
    if (userId != decodeUser.userId) throw new AuthFailureError('Invaild request')
    req.keyStore = keyToken
    return next()
  } catch (error) {
    throw error
  }

})

const authenticationV2 = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invaild request')

  const keyToken = await findByUserId(userId)
  if (!keyToken) throw new NotFoundError('Not found keytoken')

  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN]
      const decodeUser = await JWT.verify(refreshToken, keyToken.privateKey)
      if (userId != decodeUser.userId) throw new AuthFailureError('Invaild request')
      req.keyStore = keyToken
      req.user = decodeUser
      req.refreshToken = refreshToken
      return next()
    } catch (error) {
      throw error
    }

  }

  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailureError('Invaild request')

  try {
    const decodeUser = JWT.verify(accessToken, keyToken.publicKey)
    if (userId != decodeUser.userId) throw new AuthFailureError('Invaild request')
    req.keyStore = keyToken
    return next()
  } catch (error) {
    throw error
  }

})

const verifyJwt = async (token, keySecret) => {
  return JWT.verify(token, keySecret)
}

module.exports = {
  createTokenPair,
  authentication,
  authenticationV2,
  verifyJwt
}
