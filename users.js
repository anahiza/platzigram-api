'use strict'
import HttpHash from 'http-hash'
import { send, json } from 'micro'
import Db from 'platzigram-db'
import DbStub from './test/stub/db'
import config from './config'
import gravatar from 'gravatar'

const env = process.env.NODE_ENV || 'test'
const hash = HttpHash()
let db = new Db(config.db)

if (env === 'test') {
  db = new DbStub()
}

hash.set('POST /', async function saveUser (req, res, params) {
  let user = await json(req)
  await db.connect()
  let created = await db.saveUser(user)
  await db.disconnect()
  delete created.email
  delete created.password
  send(res, 201, created)
})

hash.set('GET /:username', async function getUser (req, res, params) {
  let username = params.username
  await db.connect()
  let user = await db.getUser(username)
  user.avatar = gravatar.url(user.email)
  let images = await db.getImagesByUser(username)
  user.pictures=images
  delete user.email
  delete user.password
  send(res, 201, user)
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
