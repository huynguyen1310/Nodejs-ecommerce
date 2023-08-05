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
  publicKey: {
    type: String,
    required: true
  },
  refreshToken: {
    type: Array,
    default: [],
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, keyTokenSchema)
