'use strict'
import HttpHash from 'http-hash'
import { send, json } from 'micro'
import Db from 'platzigram-db'
import DbStub from './test/stub/db'
import config from './config'
import utils from './lib/utils'

const env = process.env.NODE_ENV || 'test'
const hash = HttpHash()
let db = new Db(config.db)

if (env === 'test') {
  db = new DbStub()
}

hash.set('POST /', async function authenticate (req, res, params) {
  let credentials = await json(req)
  await db.connect()
  let auth = await db.authenticate(credentials.username, credentials.password)
  if (!auth) {
    return send(res, 401, { error: 'invalid credentials' })
  }
  let token = await utils.signToken({
    username: credentials.username
  }, config.secret)
  send(res, 200, token)
})

export default async function main (req, res) {
  let { method, url } = req
  let match = hash.get(`${method.toUpperCase()} ${url}`)
  if (match.handler) {
    try {
      await match.handler(req, res, match.params)
    } catch (e) {
      send(res, 500, { error: e.message })
    }
  } else {
    send(res, 404, {error: 'route not found'})
  }
}
