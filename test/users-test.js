'use strict'

import test from 'ava'
import listen from 'test-listen'
import request from 'request-promise'
import users from '../users'
import micro from 'micro'
import fixtures from './fixtures/'

test.beforeEach(async t => {
  let srv = micro(users)
  t.context.url = await listen(srv)
})

test('POST /', async t => {
  let user = fixtures.getUser()
  let url = t.context.url
  let options = {
    method: 'POST',
    url: url,
    json: true,
    body: {
      name: user.name,
      username: user.username,
      password: user.password,
      email: user.email
    },
    resolveWithFullResponse: true
  }
  delete user.email
  delete user.password
  let response = await request(options)
  t.is(response.statusCode, 201)
  t.deepEqual(response.body, user)
})

test.todo('GET /:username')
