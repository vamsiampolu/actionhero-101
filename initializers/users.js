'use strict'
const crypto = require('crypto')
const salt = 'asdjkafhjewiovnjksdv' // in production, you will want to change this, and probably have a unique salt for each user.

module.exports = {
  loadPriority: 1000,
  startPriority: 1000,
  stopPriority: 1000,
  initialize: function (api, next) {
    const redis = api.redis.clients.client
    api.users = {
      usersHash: 'users',
      add: function (username, password, next) {
        const {usersHash} = this
        redis.hget(usersHash, username, (error, data) => {
          if (error) {
            next(error)
          } else if (data) {
            next('username already exists')
          } else {
            this.cryptPassword(password, (error, hashedPassword) => {
              if (error) {
                next(error)
              } else {
                const now = new Date().getTime()
                const data = {
                  username,
                  hashedPassword,
                  createdAt: now
                }
                redis.hset(usersHash, username, JSON.stringify(data), error => {
                  next(error)
                })
              }
            })
          }
        })
      },
      list: function (next) {
        const {usersHash} = this
        redis.hgetall(usersHash, function (error, users) {
          let userData = []
          console.log('USERS', users)
          for (let i in users) {
            userData.push(JSON.parse(users[i]))
          }
          next(error, userData)
        })
      },
      authenticate: function (username, password, next) {
        const {usersHash} = this
        redis.hget(usersHash, username, (error, data) => {
          if (error) {
            next(error)
          } else {
            data = JSON.parse(data)
            if (data && data.hashedPassword && data.hashedPassword != null) {
              this.comparePassword(
                data.hashedPassword,
                password,
                (error, match) => {
                  next(error, match)
                }
              )
            } else {
              next('username does not exist')
            }
          }
        })
      },
      delete: function (username, password, next) {
        const {usersHash} = this
        redis.del(usersHash, username, function (error) {
          if (error) {
            return next(error)
          }
          api.blog.listUserPosts(username, (error, titles) => {
            if (titles.length === 0) {
              next(error)
            } else {
              let started = 0
              titles.forEach(title => {
                started = started + 1
                api.blog.deletePost(username, title, function (error) {
                  if (error) {
                    return next(error)
                  }
                  started = started - 1
                  if (started === 0) {
                    next()
                  }
                })
              })
            }
          })
        })
      },

      // helpers
      cryptPassword: function (password, next) {
        const hash = crypto
          .createHash('md5')
          .update(`${salt}${password}`)
          .digest('hex')
        next(null, hash)
      },
      comparePassword: function (hashedPassword, userPassword, next) {
        const hash = crypto
          .createHash('md5')
          .update(`${salt}${userPassword}`)
          .digest('hex')
        const matched = hashedPassword === hash
        next(null, matched)
      }
    }

    return next()
  },
  start: function (api, next) {
    return next()
  },
  stop: function (api, next) {
    return next()
  }
}
