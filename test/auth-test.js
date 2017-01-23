'use strict'

import test from 'ava'
import listen from 'test-listen'
import request from 'request-promise'
import users from '../users'
import micro from 'micro'
import fixtures from './fixtures/'
import config from '../config'
import utils from '../lib/utils'

test.beforeEach(async t => {
  let srv = micro(users)
  t.context.url = await listen(srv)
})

test('sucess POST /', async t => {
  let user = fixtures.getUser()
  let url = t.context.url
  let options = {
    method: 'POST',
    url: url,
    body: {
      username: user.username,
      password: user.password
    },
    json: true
  }
  let token = await request(options)
  let decoded = await utils.verifyToken(token, config.secret)
  t.is(decoded.username, user.username)
})
