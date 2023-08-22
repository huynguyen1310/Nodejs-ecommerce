'use strict'

const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const notificationController = require('../../controllers/notification.controller')
const { authenticationV2 } = require('../../auth/authUtils')

router.use(authenticationV2)

router.get('', asyncHandler(notificationController.listNotiByUser))

module.exports = router
