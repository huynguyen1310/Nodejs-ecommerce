'use strict'

const express = require('express')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const commentController = require('../../controllers/comment.controller')

router.post('', asyncHandler(commentController.createComment))
router.get('', asyncHandler(commentController.getCommentByParentId))
router.delete('', asyncHandler(commentController.deleteComment))

module.exports = router
