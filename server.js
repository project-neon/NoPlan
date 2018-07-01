const _ = require('lodash')
const chalk = require('chalk')
const inquirer = require('inquirer')
const SerialPort = require('serialport')
const comm = require('./lib/Comm.js')
require('draftlog').into(console)

const coaches = require('require-smart')('./coaches')

const Match = require('./lib/Match')
const MatchSimulated = require('./lib/MatchSimulated')
const players = require('require-smart')('./players')
const PORT = 10006
const HOST = '224.5.23.3'

const sleep = ms => new Promise((res, rej) => setTimeout(res, ms))

const TAG = 'server'

const isSimulated = !!process.env.SIMULATED
const usePrediction = !isSimulated

async function startup(){
  console.info(TAG, chalk.yellow('startup'))
  console.info(TAG, chalk.yellow('isSimulated'), isSimulated)
  console.info(TAG, chalk.yellow('usePrediction'), usePrediction)
    
  let MatchClass = (isSimulated ? MatchSimulated : Match)

  let match = new MatchClass({
    vision: { PORT, HOST },
    robots: {
      robot_1: {
        visionId: 0,
        radioId: 1,
        class: players.IntentionPlayer,
        predict: usePrediction,
      }
    },
    coach: coaches.BalancedCoach,
    driver: {
      port: (isSimulated ? null : await getPort('/dev/ttyUSB0')),
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
