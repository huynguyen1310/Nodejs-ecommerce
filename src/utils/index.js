"use strict"

const _ = require('lodash')

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, files)
}

module.exports = {
  getInfoData
}
