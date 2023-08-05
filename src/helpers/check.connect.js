'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000

const countConnect = () => {
  const numConnection = mongoose.connections.length
  console.log('number of connections:' + numConnection)
}

const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    const maxConnections = numCores * 5

    console.log(`Active Connections: ${numConnections}`)
    console.log(`Memory Usage: ${memoryUsage / 1024 / 1024} MB`)

    if (numConnections > maxConnections) {
      console.log('connection overload detected')
    }
  }, _SECONDS)
}

module.exports = {
  countConnect
}
