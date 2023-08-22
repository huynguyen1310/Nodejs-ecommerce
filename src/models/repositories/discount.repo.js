'use strict'

const { getSelecteData, unGetSelecteData } = require("../../utils")
const { product } = require("../product.model")

const findAllDiscountCodesUnSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, unSelect, model }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { id: -1 }
  const documents = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelecteData(unSelect))
    .lean()

  return documents
}

const findAllDiscountCodesSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, select, model }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { id: -1 }
  const documents = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelecteData(select))
    .lean()

  return documents
}

const checkDiscountExists = async ({ model, filter }) => {
  return await model.findOne(filter).lean()
}

module.exports = {
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  checkDiscountExists,
}
