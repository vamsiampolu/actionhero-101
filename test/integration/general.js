const request = require('request')
const should = require('should')
const setup = require('../_setup')._setup

describe('Integration Tests', function (done) {
  before(function (done) {
    setup.init(done)
  })

  it('the API should work in general', function (done) {
    const url = `${setup.testUrl}/someAction`
    request.get(url, function (error, response, body) {
      should.not.exist(error)
      body = JSON.parse(body)
      body.error.should.equal('unknown action or invalid apiVersion')
      done()
    })
  })
})
