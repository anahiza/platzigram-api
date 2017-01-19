'use strict'
import fixtures from '../fixtures/'

export default class Db {
  connect () {
    return Promise.resolve(true)
  }

  disconnect () {
    return Promise.resolve(false)
  }

  getImage (id) {
    return Promise.resolve(fixtures.getImage())
  }
}
