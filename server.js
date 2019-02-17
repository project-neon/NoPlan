const _ = require('lodash')
const chalk = require('chalk')
const assert = require('assert')
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

const RUN_MODES = {1: 'REAL_LIFE', 2: 'SIMULATED', 3: 'ASSIST'}
/*
Variavel RUN_MODE args:
  1: REAL_LIFE, Executa o fluxo completo, usado para partidas reais
  2: SIMULATED, modo simulado, usando stack SIR-LAB
  3: ASSIST   , modo assistido, onde o NoPlan recebe dados do
  SSL-Vision mas não envia para lugar algum
*/

const run_mode = process.env.RUN_MODE

assert.notEqual(run_mode, null, chalk.red('MISSING PARAMETER: RUN_MODE'))
assert.ok(run_mode in RUN_MODES, chalk.red('WRONG PARAMETER: RUN_MODE, must be 1, 2 or 3'))

const isSimulated = run_mode==2
const usePrediction = false
const noStation = run_mode==3

async function startup(){
  console.info(TAG, chalk.yellow('Startup'))
  console.info(TAG, chalk.yellow('Run mode: '), chalk.green(RUN_MODES[run_mode]))
  // FIXME: Se a simulação não esta confiavel vale tentar usar?
  // console.info(TAG, chalk.yellow('usePrediction'), usePrediction)

  let MatchClass = (isSimulated ? MatchSimulated : Match)

  if(noStation) {
    MatchClass = MatchVSSSimulated // Mudar no futuro
  }

  let match = new MatchClass({
    vision: { PORT, HOST },
    robots: {
      /*
      * Change here when testing new players implementations
      */
      attacker1: {
        visionId: 9,
        radioId: 2,
        class: test_players.PointIntentionPlayer,
        predict: usePrediction,
      }
    },
    driver: {
      port: ( (isSimulated || noStation) ? null : await getPort('/dev/ttyUSB0')),
      debug: false,
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
