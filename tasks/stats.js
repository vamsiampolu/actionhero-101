'use strict'

exports.task = {
  name: 'stats',
  description: 'an actionhero task',
  frequency: 30 * 1000,
  queue: 'default',
  plugins: [],
  pluginOptions: [],
  middleware: [],

  run: function (api, params, next) {
    let users = []
    let posts = []
    let started = 0

    var render = function () {
      api.log('*** STATUS ***')
      api.log(users.length + 'users')
      api.log(posts.length + 'posts')
      api.log('**************')
      next()
    }

    api.users.list(function (error, u) {
      if (error) {
        return next(error)
      }
      users = u
      if (users.length === 0) {
        render()
      } else {
        users.forEach(user => {
          started = started + 1
          const {username} = user
          api.blog.postsList(username, function (error, p) {
            if (error) {
              return next(error)
            }
            p.forEach(post => posts.push(post))
            started = started - 1
            if (started === 0) {
              render()
            }
          })
        })
      }
    })
  }
}
