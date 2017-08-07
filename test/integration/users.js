const request = require('request')
const should = require('should')
const setup = require('../_setup')._setup

describe('Integration tests - User', function () {
  before(function (done) {
    setup.init(done)
  })

  describe('Users', function () {
    it('allows for creating a user', function (done) {
      const url = `${setup.testUrl}/userAdd`
      const payload = {
        form: {
          username: 'evan',
          password: 'password'
        }
      }
      request.post(url, payload, function (error, response, body) {
        should.not.exist(error)
        body = JSON.parse(body)
        should.not.exist(body.error)
        done()
      })
    })

    it('disallows creation of a duplicate user', function (done) {
      const url = `${setup.testUrl}/userAdd`
      const payload = {
        form: {
          username: 'evan',
          password: 'password'
        }
      }
      request.post(url, payload, function (error, response, body) {
        should.not.exist(error)
        body = JSON.parse(body)
        body.error.should.equal('username already exists')
        done()
      })
    })

    it('allows logging in with the correct credentials', function (done) {
      const url = `${setup.testUrl}/authenticate`
      const payload = {
        form: {
          username: 'evan',
          password: 'password'
        }
      }
      request.post(url, payload, function (error, response, body) {
        should.not.exist(error)
        body = JSON.parse(body)
        body.authenticated.should.equal(true)
        should.not.exist(body.error)
        done()
      })
    })

    it('disallows login if credentials are incorrect', function (done) {
      const url = `${setup.testUrl}/authenticate`
      const payload = {
        form: {
          username: 'evan',
          password: 'plusward'
        }
      }
      request.post(url, payload, function (error, response, body) {
        debugger
        should.not.exist(error)
        body = JSON.parse(body)
        body.authenticated.should.equal(false)
        body.error.should.equal('Unable to log in')
        done()
      })

      it('displays user within a list of authenticated users', function (done) {
        const userAddUrl = `${setup.testUrl}/userAdd`
        const usersListUrl = `${setup.testUrl}/usersList`
        const userAddPayload = {
          form: {
            username: 'someoneElse',
            password: 'password'
          }
        }
        request.post(userAddUrl, userAddPayload, function (
          error,
          response,
          body
        ) {
          should.not.exist(error)
          should.not.exist(body.error)
          request.get(usersListUrl, function (error, response, body) {
            should.not.exist(error)
            body = JSON.parse(body)
            body.users.length.should.be.greaterThan(1)
            body.users.indexOf('evan').should.be.greaterThan(-1)
            should.not.exist(body.error)
            done()
          })
        })
      })
    })
  })
})
