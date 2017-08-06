const request = require('request')
const should = require('should')
const setup = require('../_setup')

describe('Integration Test - Posts', function () {
  before(function (done) {
    setup.init(function () {
      const url = `${setup.testUrl}/userAdd`
      const payload = {
        form: {
          username: 'test-poster',
          password: 'password'
        }
      }
      request.post(url, payload, function (error, response, body) {
        should.not.exist(error)
        done()
      })
    })
  })

  describe('Actions - posts', function () {
    it('can add a post', function (done) {
      const url = `${setup.testUrl}/postAdd`
      const payload = {
        username: 'testPoster',
        password: 'testPassword',
        title: 'Post Title',
        content: 'Post Content'
      }
      request.post(url, payload, function (error, response, body) {
        should.not.exist(error)
        body = JSON.parse(body)
        body.post.title.should.equal(payload.title)
        body.post.content.should.equal(payload.content)
        should.not.exist(body.error)
        done()
      })
    })

    it('shows the post in the list of posts for the user', function (
      error,
      response,
      body
    ) {
      const url = `${setup.testUrl}/postsList`
      const payload = {
        form: {
          username: 'testPoster'
        }
      }
      request.post(url, payload, function (error, response, body) {
        should.not.exist(error)
        body = JSON.parse(body)
        body.posts.indexOf('Post Title').should.equal(0)
        should.not.exist(body.error)
      })
    })

    it('does not show the post in the list of posts for another user', function (
      error,
      response,
      body
    ) {
      const url = `${setup.testUrl}/postsList`
      const payload = {
        form: {
          username: 'coolPoster'
        }
      }
      request(url, payload, function (error, response, body) {
        should.not.exist(error)
        body = JSON.parse(body)
        body.posts.should.not.containEq('Post Title')
        should.not.exist(body.error)
      })
    })
  })
})
