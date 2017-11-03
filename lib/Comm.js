const _ = require('lodash')
const path = require('path')

module.exports = function(match, options){

  var app = require('express')()
  var server = require('http').Server(app)
  var io = require('socket.io')(server)
  server.listen(options.PORT)
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../static/index.html'))
  })

  match.vision.on('detection',(detection) => {
    io.sockets.emit('detection', detection);
  })

  io.on('connection', function (socket) {
    socket.on('state', function (data) {
      if (data.state == "toggle") {
        if(match.state.state.status == "running"){
          match.state.setState({status:"stopped"})
          } else {
          match.state.setState({status:"running"})
        }
      }
      if(data.state == "side") {
         if(match.state.state.side == "left"){
          match.state.setState({side:"right"})
          } else {
          match.state.setState({side:"left"})
        } 
      }
    })
  })

}