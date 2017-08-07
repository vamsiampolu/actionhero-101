exports._setup = {
  ServerPrototype: require('../node_modules/actionhero/actionhero.js'),
  testUrl: 'http://127.0.0.1:3000/api',
  init: function (callback) {
    if (!this.server) {
      console.log('[----  Starting test server  ----]')
      this.server = new this.ServerPrototype()
      this.server.start(function (error, api) {
        if (error) {
          callback(error)
        }
        this.api = api
        console.log('Calling done')
        callback()
      })
    } else {
      callback()
    }
  }
}
