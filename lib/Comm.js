const _ = require('lodash')
const path = require('path')

module.exports = function(match, options){

  var app = require('express')()
  var server = require('http').Server(app)
  var io = require('socket.io')(server)
  server.listen(options.PORT)
  app.get('/', function (req, res) {
    res.sendfile(path.join(__dirname + '/../static/index.html'))
  })

  match.vision.on('detection',(detection) => {
    io.sockets.emit('detection', detection);
  })


}