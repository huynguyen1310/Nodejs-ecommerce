'use strict'

const { SuccessResponse } = require('../core/success.response')
const CommentService = require('../services/comment.service')

class CommentController {
  createcomment = async (req, res, next) => {
    new SuccessResponse({
      message: 'create new comment success',
      metadata: await CommentService.createcomment(req.body)
    }).send(res)
  }

  deleteComment = async (req, res, next) => {
    new SuccessResponse({
      message: 'delete comment success',
      metadata: await CommentService.deleteComment(req.body)
    }).send(res)
  }

  getCommentByParentId = async (req, res, next) => {
    new SuccessResponse({
      message: 'List comments success',
      metadata: await CommentService.getCommentsByParentId(req.query)
    }).send(res)

  }
}

module.exports = new CommentController()
