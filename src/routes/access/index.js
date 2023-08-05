'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const router = express.Router()

router.post('/shop/signup', accessController.signUp)
// router.post('/shop/signup', (req, res, next) => {
//   res.status(200).json(req.body)
// })

module.exports = router
