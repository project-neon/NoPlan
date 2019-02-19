const _ = require('lodash')
const chalk = require('chalk')
const assert = require('assert')
const inquirer = require('inquirer')
const comm = require('./lib/Comm.js')
require('draftlog').into(console)

const Match = require('./lib/Match')
const MatchSimulated = require('./lib/MatchSimulated')
const MatchVSSSimulated = require('./lib/MatchVSSSimulated')

const players = require('require-smart')('./players')
const test_players = require('require-smart')('./players/tests')

const Coach = require('./lib/Coach')

const PORT = 10006
const HOST = '224.5.23.2'

const sleep = ms => new Promise((res, rej) => setTimeout(res, ms))
const TAG = 'server'

const RUN_MODES = {1: 'REAL_LIFE', 2: 'SIMULATED', 3: 'ASSIST'}

const config = null
/*
Variavel RUN_MODE args:
  1: REAL_LIFE, Executa o fluxo completo, usado para partidas reais
  2: SIMULATED, modo simulado, usando stack SIR-LAB
  3: ASSIST   , modo assistido, onde o NoPlan recebe dados do
  SSL-Vision mas não envia para lugar algum
*/

const run_mode = parseInt(process.env.RUN_MODE)

assert.notEqual(run_mode, null, chalk.red('MISSING PARAMETER: RUN_MODE'))
assert.ok(run_mode in RUN_MODES, chalk.red('WRONG PARAMETER: RUN_MODE, must be 1, 2 or 3'))

async function startup(){
  console.info(TAG, chalk.yellow('Startup'))
  console.info(TAG, chalk.yellow('Run mode: '), chalk.green(RUN_MODES[run_mode]))
  const config = require('./config.json')

  let visionImpl = config.vision
  let driverImpl = config.driver

  let MatchClass = null
  switch (run_mode) {
    case 1:
      MatchClass = Match
      break
    case 2:
      MatchClass = MatchSimulated
      break
    case 3:
      MatchClass = MatchVSSSimulated
      break
  }

  let match = new MatchClass({
    // Vision: Dados referentes ao input de dados da visão
    // Coach: Dados de configuração do Coach que ira orquestrar a partida
    // Driver: dados referentes ao output de dados de envio para os robos
    vision: {impl: visionImpl, params: config[visionImpl]},
    driver: {impl: driverImpl, params: config[driverImpl]},
    coach: Coach,
    robotsProperties: {robot_1: {vision_id: 1, radio_id:1}},
    // driver: {
    //   port: (run_mode in [2, 3] ? null : await getPort('/dev/ttyUSB0')),
    //   debug: false,
    //   baudRate: 115200,
    // }
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
