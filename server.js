const _ = require('lodash')
const chalk = require('chalk')
const inquirer = require('inquirer')
const SerialPort = require('serialport')
const comm = require('./lib/Comm.js')
require('draftlog').into(console)

const Match = require('./lib/Match')
const MatchSimulated = require('./lib/MatchSimulated')
const MatchSSLSimulated = require('./lib/MatchSSLSimulated')

const players = require('require-smart')('./players')
const PORT = 10006
const HOST = '224.5.23.2'

const sleep = ms => new Promise((res, rej) => setTimeout(res, ms))

const TAG = 'server'

const isSimulated = !!process.env.SIMULATED
const usePrediction = false
const noStation = process.env.NO_STATION | false

async function startup(){
  console.info(TAG, chalk.yellow('startup'))
  console.info(TAG, chalk.yellow('isSimulated'), isSimulated)
  console.info(TAG, chalk.yellow('usePrediction'), usePrediction)
    
  let MatchClass = (isSimulated ? MatchSimulated : Match)

  if(noStation) {
    MatchClass = MatchSSLSimulated
  }

  let match = new MatchClass({
    vision: { PORT, HOST },
    robots: {
      attacker: {
        visionId: 2,
        radioId: 2,
        class: players.TestPlayer2,
        predict: usePrediction,
      }
    },
    driver: {
      port: ( (isSimulated || noStation) ? null : await getPort('/dev/ttyUSB0')),
      debug: true,
      baudRate: 115200,
    }
  })

  await match.init()
  console.log('Listening in:', PORT)
  
  await comm(match, {PORT:8080})

}

process.on('unhandledRejection', (e) => {
  console.error('Unhandled Rejection')
  console.error(e)
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
