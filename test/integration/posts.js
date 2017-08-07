debugger
console.log('Inside posts')
const request = require('request')
const should = require('should')
const setup = require('../_setup')._setup
console.log('SETUP FN', setup)

describe('Integration Test - Posts', function () {
  before(function (done) {
    debugger
    setup.init(function () {
      debugger
      console.log('Init of posts')
      const url = `${setup.testUrl}/userAdd`
      const payload = {
        form: {
          username: 'test-poster',
          password: 'test-password'
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
      debugger
      const url = `${setup.testUrl}/postAdd`
      const payload = {
        form: {
          username: 'test-poster',
          password: 'test-password',
          title: 'Post Title',
          content: 'Post Content'
        }
      }
      request.post(url, payload, function (error, response, body) {
        debugger
        should.not.exist(error)
        body = JSON.parse(body)
        should.not.exist(body.error)
        done()
      })
    })

    it('shows the post in the list of posts for the user', function (done) {
      debugger
      const url = `${setup.testUrl}/postsList`
      const payload = {
        form: {
          username: 'test-poster'
        }
      }
      request.post(url, payload, function (error, response, body) {
        should.not.exist(error)
        body = JSON.parse(body)
        body.posts.indexOf('Post Title').should.equal(0)
        should.not.exist(body.error)
        done()
      })
    })

    it('does not show the post in the list of posts for another user', function (
      done
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
        done()
      })
    })

    it('allows viewing a post', function (done) {
      const url = `${request.testUrl}/postView`
      const payload = {
        form: {
          username: 'test-poster',
          password: 'test-password',
          title: 'Post Title'
        }
      }
      request(url, payload, function (error, response, body) {
        should.not.exist(error)
        body = JSON.parse(body)
        body.post.title.should.equal('Post Title')
        body.post.content.should.equal('Post Content')
        should.not.exist(body.error)
        done()
      })
    })
  })
})
