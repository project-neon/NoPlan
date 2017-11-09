const _ = require('lodash')
const path = require('path')

module.exports = function(match, options){

  var app = require('express')()
  var server = require('http').Server(app)
  var io = require('socket.io')(server)
  var favicon = require('serve-favicon')

  server.listen(options.PORT)

  app.use(favicon(path.join(__dirname,'/../static/favicon.ico')))

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../static/index.html'))
  })

  match.vision.on('detection',(detection) => {
    
    io.sockets.emit('detection', detection)

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

    socket.on('simulation', function (data) {
      if (data.key == "up") { match.ball.y += 10}
      else if (data.key == "down") { match.ball.y -= 10}
      else if (data.key == "left") { match.ball.x -= 10}
      else if (data.key == "right") { match.ball.x += 10}
    })
  })

}