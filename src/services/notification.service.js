'use strict'

const notificationModel = require("../models/notification.model")

const pushNotiToSystem = async ({
  type = 'SHOP-001',
  receivedId = 1,
  senderId = 1,
  options = {}
}) => {
  let noti_content

  if (type === 'SHOP-001') {
    noti_content = 'new product added'
  } else if (type === 'PROMOTION-001') {
    noti_content = 'new promotion added'
  }

  const newNoti = await notificationModel.create({
    noti_type: type,
    noti_content,
    noti_senderId: senderId,
    noti_reciverId: receivedId,
    noti_options: options
  })

  return newNoti
}

const listNotiByUser = async ({
  userId = 1,
  type = 'ALL',
  isRead = 0
}) => {
  const match = { noti_receivedId: userId }
  if (type !== 'ALL') {
    match['noti_type'] = type
  }

  const noti = await notificationModel.aggregate([
    {
      $match: {
        noti_reciverId: userId,
        noti_type: type
      }
    },
    {
      $project: {
        noti_type: 1,
        noti_senderId: 1,
        noti_reciverId: 1,
        noti_content: 1,
        createdAt: 1,
        noti_options: 1
      }
    }
  ]).exec()

  return noti
}

module.exports = {
  pushNotiToSystem,
  listNotiByUser
}

