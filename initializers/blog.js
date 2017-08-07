'use strict'

module.exports = {
  loadPriority: 1000,
  startPriority: 1000,
  stopPriority: 1000,
  initialize: function (api, next) {
    const redis = api.redis.clients.client
    api.blog = {
      // constants
      seperator: ';',
      postPrefix: 'posts',
      commentPrefix: 'comments',
      // posts
      postAdd: function (username, title, content, next) {
        const key = this.buildTitleKey(username, title)
        const now = new Date().getTime()
        const data = {
          title,
          content,
          createdAt: now,
          updatedAt: now
        }
        redis.hmset(key, data, function (err, data) {
          next(err, data)
        })
      },
      postView: function (username, title, next) {
        const key = this.buildTitleKey(username, title)
        redis.hgetall(key, function (error, data) {
          next(error, data)
        })
      },
      postsList: function (username, next) {
        debugger
        const {postPrefix, seperator} = this
        const search = `${postPrefix}${seperator}${username}${seperator}*`
        redis.keys(search, (error, keys) => {
          let titles = []
          keys.forEach(key => {
            const parts = key.split(seperator)
            const last = parts[parts.length - 1]
            titles.push(last)
          })
          titles.sort()
          next(error, titles)
        })
      },
      postEdit: function (username, title, content, next) {
        const key = this.buildTitleKey(username, title)
        this.postView(key, (error, data) => {
          if (error) {
            return next(error)
          }
          const now = new Date().getTime()
          const newData = {
            content,
            title,
            username,
            updatedAt: now
          }

          redis.hmset(key, newData, function (error) {
            next(error)
          })
        })
      },
      postDelete: function (username, title, next) {
        const key = this.buildTitleKey(username, title)
        redis.del(key, error => {
          if (error) {
            next(error)
          } else {
            const commentKey = this.buildCommentKey(username, title)
            redis.del(commentKey, function (error) {
              next(error)
            })
          }
        })
      },

      // comments
      commentAdd: function (username, title, commentername, comment, next) {
        const key = this.buildCommentKey(username, title)
        const commentId = this.buildCommentId(commentername)
        const now = new Date().getTime()
        const data = {
          comment,
          commentId,
          createdAt: now
        }
        redis.hset(key, commentId, JSON.stringify(data), function (error) {
          next(error)
        })
      },
      commentsView: function (username, title, next) {
        const key = this.buildCommentKey(username, title)
        redis.hgetall(key, function (error, data) {
          let comments = []
          try {
            for (let key in data) {
              comments.push(JSON.parse(data[key]))
            }
          } catch (err) {
            next(err)
          }
          next(error, comments)
        })
      },
      commentDelete: function (username, title, commentId, next) {
        const key = this.buildCommentKey(username, title)
        redis.hdel(key, commentId, function (error) {
          next(error)
        })
      },
      // helpers
      buildTitleKey: function (username, title) {
        const {seperator, postPrefix} = this
        return `${postPrefix}${seperator}${username}${seperator}${title}`
      },
      buildCommentKey: function (username, title) {
        const {seperator, commentPrefix} = this
        return `${commentPrefix}${seperator}${username}${title}`
      },
      buildCommentId: function (commentername) {
        const date = new Date().getTime()
        return `${commentername}${date}`
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
