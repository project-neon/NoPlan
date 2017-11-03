const _ = require('lodash')
const chalk = require('chalk')
const inquirer = require('inquirer')
const SerialPort = require('serialport')
const comm = require('./lib/Comm.js')
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
      fretado: {visionId: 1, radioId: 2, class: players.Attacker},
      piso_vermelho: {visionId: 3, radioId: 3, class: players.Attacker},
      torre_do_relogio: {visionId: 5, radioId: 1, class: players.Attacker}
    },
    driver: {
      port: await getPort('/dev/tty.usbserial-A10252WB'),
      debug: false,
      baudRate: 500000,
    }
  })
  await match.init()
  console.log('Listening in:', PORT)
  
  await comm(match, {PORT:80})

}

process.on('unhandledRejection', (e) => {
  console.error('Unhandled Rejection')
  console.error(e.toString())
  process.exit(1)
})

startup()

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
