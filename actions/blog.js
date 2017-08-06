'use strict'

exports.postAdd = {
  name: 'postAdd',
  description: 'Adds a post',
  inputs: {
    username: {required: true},
    password: {required: true},
    title: {required: true},
    content: {required: true}
  },
  authenticated: true,
  outputExample: {},
  version: 1.0,
  run: function (api, data, next) {
    const {username, title, content} = data.params
    api.blog.postAdd(username, title, content, function (error) {
      next(error)
    })
  }
}

exports.postView = {
  name: 'postView',
  description: 'Views a post',
  inputs: {
    username: {required: true},
    title: {required: true}
  },
  authenticated: false,
  outputExample: {},
  version: 1.0,
  run: function (api, data, next) {
    const {username, title} = data.params
    api.blog.postView(username, title, function (error, post) {
      data.response.post = post
      next(error)
    })
  }
}

exports.postsList = {
  name: 'postsList',
  description: `Lists all the user's posts`,
  inputs: {
    username: {
      required: true
    }
  },
  authenticated: false,
  outputExample: {},
  version: 1.0,
  run: function (api, data, next) {
    const {username} = data.params
    api.blog.postsList(username, function (error, posts) {
      data.response.posts = posts
      next(error)
    })
  }
}

exports.postEdit = {
  name: 'postEdit',
  description: 'Edits a Post',
  inputs: {
    username: {required: true},
    password: {required: true},
    title: {required: true},
    content: {required: true}
  },
  authenticated: true,
  outputExample: {},
  version: 1.0,
  run: function (api, data, next) {
    const {username, title, content} = data.params
    api.blog.postEdit(username, title, content, function (err, data) {
      next(err)
    })
  }
}

exports.postDelete = {
  name: 'postDelete',
  description: 'Deletes a post',
  inputs: {
    username: {required: true},
    password: {required: true},
    title: {required: true}
  },
  authenticated: true,
  outputExample: {},
  version: 1.0,
  run: function (api, data, next) {
    const {username, title} = data.params
    api.blog.postDelete(username, title, function (err) {
      next(err)
    })
  }
}

exports.commentAdd = {
  name: 'commentAdd',
  description: 'Adds a comment',
  inputs: {
    username: {required: true},
    commentername: {required: true},
    title: {required: true},
    comment: {required: true}
  },
  authenticated: false,
  outputExample: {},
  version: 1.0,
  run: function (api, data, next) {
    const {username, commentername, title, comment} = data.params
    api.blog.commentAdd(username, commentername, title, comment, function (
      error
    ) {
      next(error)
    })
  }
}

exports.commentsView = {
  name: 'commentsView',
  description: 'I show all comments for a post',
  inputs: {
    username: {required: true},
    title: {required: true}
  },
  authenticated: false,
  outputExample: {},
  version: 1.0,
  run: function (api, data, next) {
    const {username, title} = data.params
    api.blog.commentsView(username, title, function (err, comments) {
      data.response.comments = comments
      next(err)
    })
  }
}

exports.commentDelete = {
  name: 'commentDelete',
  description: 'Deletes a comment',
  inputs: {
    username: {required: true},
    password: {required: true},
    commentId: {required: true},
    title: {required: true}
  },
  authenticated: false,
  outputExample: {},
  version: 1.0,
  run: function (api, data, next) {
    const {username, title, commentId} = data.params
    api.blog.commentDelete(username, title, commentId, function (error) {
      next(error)
    })
  }
}

exports.action = {
  name: 'blog',
  description: 'an actionhero action',
  blockedConnectionTypes: [],
  outputExample: {},
  matchExtensionMimeType: false,
  version: 1.0,
  toDocument: true,
  middleware: [],

  inputs: {},

  run: function (api, data, next) {
    let error = null
    // your logic here
    return next(error)
  }
}
