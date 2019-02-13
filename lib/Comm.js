const _ = require('lodash')
const path = require('path')
const dataManager = require('./DataManager')

module.exports = function(match, options){

  var express = require('express')
  var app = express()
  var path = require('path')
  var server = require('http').Server(app)
  var io = require('socket.io')(server)
  var favicon = require('serve-favicon')
  var data_manager = new dataManager


  server.listen(options.PORT)

  app.use(favicon(path.join(__dirname,'/../static/favicon.ico')))

  app.use(express.static(path.join(__dirname,'/../static')))

  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../static/index.html'))
  })

  match.vision.on('detection',(detection) => {
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
      if(data.state == "side") {
         if(match.state.state.side == "left"){
          match.state.setState({side:"right"})
          } else {
            match.state.setState({side:"left"})
         }
         if(match.state.state.team == "blue") {
          match.state.setState({team: "yellow"})
         } else {
          match.state.setState({team: "blue"})
         }
      }
    })

    socket.on('simulation', function (data) {
      // if (data.key == "up" && data.key1 == '') {
      //   match.ball.y += 25
      //   // match.driver.send(2,1,30,0)
      // }
      // else if (data.key == "down" && data.key1 == '') {
      //   match.ball.y -= 25
      //   // match.driver.send(2,1,-30,0)
      // }
      // else if (data.key == "left" && data.key1 == '') {
      //   match.ball.x -= 25
      //   // match.driver.send(2,1,0,-90)
      // }
      // else if (data.key == "right" && data.key1 == '') {
      //   match.ball.x += 25
      //   // match.driver.send(2,1,0,90)
      // }
      // else if (data.key == "up" && data.key1 == 'left') {
      //   match.ball.y += 25;
      //   match.ball.x -= 25;
      //   // match.driver.send(2,1,30,0)
      // }
      // else if (data.key == "up" && data.key1 == 'right') {
      //   match.ball.y += 25;
      //   match.ball.x += 25
      //   // match.driver.send(2,1,30,0)
      // }
      // else if (data.key == "down" && data.key1 == 'left') {
      //   match.ball.y -= 25;
      //   match.ball.x -= 25;
      //   // match.driver.send(2,1,30,0)
      // }
      // else if (data.key == "down" && data.key1 == 'right') {
      //   match.ball.y -= 25;
      //   match.ball.x += 25
      //   // match.driver.send(2,1,30,0)
      // }
    })
  })
}
