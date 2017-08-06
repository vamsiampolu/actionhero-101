'use strict'

exports.userAdd = {
  name: 'userAdd',
  description: 'Adds a user',
  inputs: {
    username: {
      required: true
    },
    password: {
      required: true
    }
  },
  authenticated: false,
  outputExample: {},
  version: '1.0',
  run: function (api, data, next) {
    const {username, password} = data.params
    api.users.add(username, password, function (error) {
      next(error)
    })
  }
}

exports.userDelete = {
  name: 'userDelete',
  description: 'Deletes a user',
  inputs: {
    username: {required: true},
    password: {required: true}
  },
  authenticated: true,
  outputExample: {},
  version: 1.0,
  run: function (api, data, next) {
    const {username, password} = data.params
    api.users.delete(username, password, function (error) {
      next(error)
    })
  }
}

exports.userList = {
  name: 'usersList',
  description: 'A list of all the users',
  authenticated: false,
  outputExample: {},
  version: 1.0,
  run: function (api, data, next) {
    api.users.list(function (err, users) {
      data.response.users = []
      for (let user of users) {
        const {username} = user
        data.response.users.push(username)
      }
      next(err)
    })
  }
}

exports.authenticate = {
  name: 'authenticate',
  description: 'Authenticates a user',
  inputs: {
    username: {
      required: true
    },
    password: {
      required: true
    }
  },
  authenticated: false,
  outputExample: {},
  version: 1.0,
  run: function (api, data, next) {
    const {username, password} = data.params
    api.users.authenticate(username, password, function (error, match) {
      data.response.authenticated = match
      if (match === false && !error) {
        error = new Error('Unable to log in')
      }
      next(error)
    })
  }
}
