const _ = require('lodash')
const chalk = require('chalk')
const inquirer = require('inquirer')
const SerialPort = require('serialport')
const comm = require('./lib/Comm.js')
require('draftlog').into(console)

const Match = require('./lib/Match')
const MatchSimulated = require('./lib/MatchSimulated')
const MatchVSSSimulated = require('./lib/MatchVSSSimulated')

const players = require('require-smart')('./players')
const test_players = require('require-smart')('./players/tests')
const PORT = 10006
const HOST = '224.5.23.2'

const sleep = ms => new Promise((res, rej) => setTimeout(res, ms))

const TAG = 'server'

const isSimulated = !!process.env.SIMULATED
const usePrediction = false
const noStation = process.env.NO_STATION | false

async function startup(){
  console.info(TAG, chalk.yellow('Startup'))
  console.info(TAG, chalk.yellow('Run mode: '), chalk.green(RUN_MODES[run_mode]))
  // FIXME: Se a simulação não esta confiavel vale tentar usar?
  // console.info(TAG, chalk.yellow('usePrediction'), usePrediction)

  let MatchClass = (isSimulated ? MatchVSSSimulated : Match)

  if(noStation) {
    MatchClass = MatchVSSSimulated // Mudar no futuro
  }

  let match = new MatchClass({
    vision: { PORT, HOST },
    robots: {
      /*
      * Change here when testing new players implementations
      */
      attacker: {
        visionId: 1,
        radioId: 1,
        class: test_players.LineIntentionPlayer,
        predict: usePrediction,
      }
      ,
      attacker2: {
        visionId: 2,
        radioId: 2,
        class: test_players.LineIntentionPlayer,
        predict: usePrediction,
      },
      attacker3: {
        visionId: 0,
        radioId: 0,
        class: test_players.LineIntentionPlayer,
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
