'use strict'
import HttpHash from 'http-hash'
import { send } from 'micro'
import Db from 'platzigram-db'
import DbStub from './test/stub/db'
import config from './config'

const env = process.env.NODE_ENV || 'production'
const hash = HttpHash()
let db = new Db(config.db)

if (env === 'test') {
  db = new DbStub()
}

hash.set('GET /:id', async function getPicture (req, res, params) {
  let id = params.id
  await db.connect()
  let image = await db.getImage(id)
  await db.disconnect()
  send(res, 200, image)
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
