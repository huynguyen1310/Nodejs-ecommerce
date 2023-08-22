'use strict'

const { resolve } = require('path')
const redis = require('redis')
const { promisify } = require('util')
const { reservationInventory } = require('../models/repositories/inventory.repo')
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setxAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`
  const retryTimes = 10
  const expireTime = 3000 //seconds

  for (let i = 0; i < retryTimes.length; i++) {
    const result = await setxAsync(key, expireTime)

    if (result === 1) {
      const isReversation = await reservationInventory({
        productId, quantity, cartId
      })

      if (isReversation.modifiedCount) {
        await pexpire(key, expireTime)
        return key
      }

      return null
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

const releaseLock = async keyLock => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient)
  return await delAsyncKey(keyLock)
}

module.exports = {
  acquireLock,
  releaseLock
}
