const _ = require('lodash')
const chalk = require('chalk')
const inquirer = require('inquirer')
const SerialPort = require('serialport')
const comm = require('./lib/Comm.js')
require('draftlog').into(console)

const Match = require('./lib/Match')
const MatchSimulated = require('./lib/MatchSimulated')
const players = require('require-smart')('./players')
const PORT = 10006
const HOST = '224.5.23.2'

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
      robo_1: {
        visionId: 0,
        radioId: 1,
        class: players.GoalKeeper,
        predict: usePrediction,
        GOAL_LINE_X: 650,
      },
      // robo_2: {
      //   visionId: 9,
      //   radioId: 3,
      //   class: players.GoalKeeper,
      //   predict: usePrediction,
      //   GOAL_LINE_X: 330,
      // },
      // robo_3: {
      //   visionId: 0,
      //   radioId: 1,
      //   class: players.NewAttacker,
      //   predict: usePrediction,
      // },
    },
    driver: {
      port: (isSimulated ? null : await getPort('/dev/tty.usbserial-A10252WB')),
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
