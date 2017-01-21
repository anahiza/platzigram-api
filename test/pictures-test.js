'use strict'

import test from 'ava'
import listen from 'test-listen'
import request from 'request-promise'
import pictures from '../pictures'
import micro from 'micro'
import fixtures from './fixtures/'

test.beforeEach(async t => {
  let srv = micro(pictures)
  t.context.url = await listen(srv)
})

test('GET /:id', async t => {
  let image = fixtures.getImage()
  let url = t.context.url
  let body = await request({ url: `${url}/${image.publicId}`, json: true })
  t.deepEqual(body, image)
})

test('POST /', async t => {
  let image = fixtures.getImage()
  let url = t.context.url
  let options = {
    method: 'POST',
    url: url,
    json: true,
    body: {
      description: image.description,
      src: image.src,
      userId: image.userId
    },
    resolveWithFullResponse: true
  }
  let response = await (request(options))
  t.is(response.statusCode, 201)
  t.deepEqual(response.body, image)
})

test('POST /:id/like', async t => {
  let image = fixtures.getImage()
  let url = t.context.url
  let options = {
    method: 'POST',
    url: `${url}/${image.id}/like`,
    json: true
  }
  let body = await request(options)
  let imageNew = JSON.parse(JSON.stringify(image))
  imageNew.liked = true
  imageNew.likes = 1
  t.deepEqual(body, imageNew)
})
