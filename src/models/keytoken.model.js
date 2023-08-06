'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'KEYS'

var keyTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'Shop'
  },
  privateKey: {
    type: String,
    require: true
  },
  publicKey: {
    type: String,
    required: true
  },
  refreshTokensUsed: {
    type: Array,
    default: [],
  },
  refreshToken: {
    type: String,
    requried: true
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, keyTokenSchema)
