'use strict'

const mongoose = require('mongoose')
const { db: { host, name, port, user, password } } = require('../configs/config.mongodb')
const { countConnect } = require('../helpers/check.connect')

class Database {
  constructor() {
    this.connect()
  }

  connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    mongoose.connect(`mongodb://${host}:${port}/${name}`, {
      authSource: "admin",
      user,
      pass: password
    })
      .then(_ => console.log('Connected to MongoDB', countConnect()))
      .catch(err => console.log(`Error connect ${err}`))
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb
