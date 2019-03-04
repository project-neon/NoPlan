const _ = require('lodash')
const path = require('path')

module.exports = function(match, options){

  var express = require('express')
  var app = express()
  var path = require('path')
  var server = require('http').Server(app)
  var io = require('socket.io')(server)
  var favicon = require('serve-favicon')

  server.listen(options.PORT)

  app.use(favicon(path.join(__dirname,'/../static/favicon.ico')))

  app.use(express.static(path.join(__dirname,'/../static')))

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../static/index.html'))
  })

  match.dataManager.vision.on('detection',(detection) => {
    // console.log(mapDict(match.worker.workers, x => x.getIntentionsInfo())['robo_1'])
    io.sockets.emit(
        'detection',
        {
          'detection': detection,
          'intentions': {}//mapDict(match.worker.workers, x => x.getIntentionsInfo())
        }
      )

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
      if (data.type == "side") {
        match.state.setState({side: data.state})
      }
      if (data.type == "color") {
        match.state.setState({team: data.state})
      }
    })
  })
}
