const _ = require('lodash')
const chalk = require('chalk')
const inquirer = require('inquirer')
const SerialPort = require('serialport')
const express = require('express')
const app = express()
const path = require('path')
require('draftlog').into(console)

const Match = require('./lib/Match')
const players = require('require-smart')('./players')

const PORT = 10006
const HOST = '224.5.23.2'

const sleep = ms => new Promise((res, rej) => setTimeout(res, ms))

const TAG = 'server'

async function startup(){
  console.info(TAG, chalk.yellow('startup'))
  
  let match = new Match({
    vision: { PORT, HOST },
    robots: {
      fretado: {visionId: 2, radioId: 2, class: players.Attacker},
      piso_vermelho: {visionId: 0, radioId: 3, class: players.Attacker},
      torre_do_relogio: {visionId: 4, radioId: 1, class: players.Attacker}
    },
    driver: {
      port: await getPort('/dev/tty.usbserial-A10252WB'),
      debug: false,
      baudRate: 500000,
    }
  })
  await match.init()
  console.log('Listening in:', PORT)
  app.listen(80, function () {
  console.log('View listening on port 80!')
}) 
}

process.on('unhandledRejection', (e) => {
  console.error('Unhandled Rejection')
  console.error(e.toString())
  process.exit(1)
})

startup()

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'/static/index.html'))
})


async function getPort(prefered) {
  let ports = await SerialPort.list()
  let found = _.find(ports, {comName: prefered})
  if (found)
    return prefered

  console.log(`Port '${prefered}' not available`)

  let answer = await inquirer.prompt({
    type: 'list', 
    name: 'port',
    choices: _.map(ports, 'comName'),
    message: 'Select Cursor port'
  })

  return answer.port
}

// async initSocket() {
//   this.socket = new SocketIo(...)
//   // Wait be ready
//   await this.socket.ready()

//   // Bind to vision events
//   this.vision.on('detection', detection => {
//     this.socket.broadcast({type: 'detection', detection})
//   })

//   // Bind to state change events
//   this.state.on('change', change => {
//     this.socket.broadcast({type: 'state', state})
//   })

//   // Update state
//   this.socket.on('set:state', data => {
//     this.state.setState(data)
//   })
// }

