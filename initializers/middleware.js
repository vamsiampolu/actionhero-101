'use strict'

module.exports = {
  loadPriority: 1000,
  startPriority: 1000,
  stopPriority: 1000,
  initialize: function (api, next) {
    const authenticationMiddleware = {
      name: 'authentication middleware',
      global: true,
      preProcessor: function (data, next) {
        if (data.actionTemplate.authenticated === true) {
          api.users.authenticate(
            data.params.username,
            data.params.password,
            function (error, match) {
              if (match === true) {
                next()
              } else {
                error = `Authentication failed username and password required`
                next(error)
              }
            }
          )
        } else {
          next()
        }
      }
    }
    api.actions.addMiddleware(authenticationMiddleware)
    return next()
  },
  start: function (api, next) {
    return next()
  },
  stop: function (api, next) {
    return next()
  }
}
