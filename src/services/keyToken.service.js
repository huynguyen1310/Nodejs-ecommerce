'use strict'

const keytokenModel = require("../models/keytoken.model")
const { Types } = require('mongoose')

class KeyTokenService {
  static createToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      // NORMAL WAY
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // })

      //BETTER WAY
      const filter = { user: userId }
      const update = {
        publicKey, privateKey, refreshTokensUsed: [], refreshToken
      }
      const options = { upsert: true, new: true }

      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

      return tokens ? tokens.publicKey : null

    } catch (error) {
      return error
    }
  }

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
  }

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne(id)
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken })
  }

  static deleteKeyById = async (id) => {
    return await keytokenModel.deleteOne({ userId: new Types.ObjectId(id) })
  }

}

module.exports = KeyTokenService
