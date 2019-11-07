const _ = require('lodash')
const chalk = require('chalk')
const assert = require('assert')
const comm = require('./lib/Comm.js')
require('draftlog').into(console)

const Match = require('./lib/Match')

const TAG = 'server'

const RUN_MODES = {
  1: 'REAL_LIFE', 2: 'SIMPLE_SIMULATED', 
  3: 'SIMULATED', 4: 'PASSIVE'
}

const run_mode = parseInt(process.env.RUN_MODE)
console.log(run_mode)
assert.notEqual(run_mode, null, chalk.red('MISSING PARAMETER: RUN_MODE'))
assert.ok(run_mode in RUN_MODES, chalk.red('WRONG PARAMETER: RUN_MODE, must be 1, 2 or 3'))

async function startup(){
  console.info(TAG, chalk.yellow('Startup'))
  console.info(TAG, chalk.yellow('Run mode: '), chalk.green(RUN_MODES[run_mode]))
  const config = require('./config.json')

  let visionImpl = null
  let driverImpl = null

  let MatchClass = Match
  let CoachClass = require('./lib/DumbCoach')

  switch (run_mode) {
    case 1:
      visionImpl = 'ssl-vision'
      driverImpl = 'serial-driver'
      break
    case 2:
      visionImpl = 'simple-simulation-vision'
      driverImpl = 'simple-simulation-driver'
      break
    case 3:
      visionImpl = 'vss-vision'
      driverImpl = 'vss-driver'
      break
    case 4:
      visionImpl = 'ssl-vision'
      driverImpl = 'mock-driver'
      break
    default:
      visionImpl = config.vision
      driverImpl = config.driver
  }

  let match = new MatchClass({
    // Vision: Dados referentes ao input de dados da visão
    // Coach: Dados de configuração do Coach que ira orquestrar a partida
    // Driver: dados referentes ao output de dados de envio para os robos
    vision: {impl: visionImpl, params: config[visionImpl]},
    driver: {impl: driverImpl, params: config[driverImpl]},
    coaches: [CoachClass, CoachClass],
    matchParams: {
      'startSide': config.startSide, 
      'startColor': config.startColor
    },
    robotsProperties:[
      {
        // TEAM 1
        // robot_0: {vision_id: 9, radio_id: 2}
        robot_0: {vision_id: 0, radio_id: 0},
        robot_1: {vision_id: 1, radio_id: 1},
        robot_2: {vision_id: 2, radio_id: 2}
      },
      {
        // TEAM 2
        robot_3: {vision_id: 3, radio_id: 3},
        robot_4: {vision_id: 4, radio_id: 4},
        robot_5: {vision_id: 5, radio_id: 5}
      }
    ],
  })

  await match.init()

  await comm(match, {PORT:8080})

}

process.on('unhandledRejection', (e) => {
  console.error('Unhandled Rejection')
  console.error(e)
  process.exit(1)
})

startup()
