'use strict'

const express = require('express')
const router = express.Router()

router.use('/v1/api', require('./access'))
// router.post('/test', (req, res, next) => {
//   res.status(200).json({
//     message: req.body
//   })
// })

module.exports = router
