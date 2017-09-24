const _ = require('lodash')
const chalk = require('chalk')
const inquirer = require('inquirer')
const SerialPort = require('serialport')

require('draftlog').into(console)

const Match = require('./lib/Match')

const players = require('require-smart')('./players')

const PORT = process.env.PORT || 10002
const HOST = process.env.HOST || '224.5.23.2'

const sleep = ms => new Promise((res, rej) => setTimeout(res, ms))

const TAG = 'server'
async function startup(){
  console.info(TAG, chalk.yellow('startup'))
  
  let match = new Match({
    vision: { PORT, HOST },
    robots: {
      red: {visionId: 1, radioId: 1, class: players.Attacker}
    },
    driver: {
      port: await getPort('/dev/tty.usbserial-A10252WB'),
      // debug: true,
      baudRate: 500000,
    }
  })

  await match.init()
  console.log('Listening in:', PORT)

  // match.vision.on('data', console.log)

  console.log('front ..')
  let stats = console.draft('...')
  let statsTimes1 = console.draft('...')
  let statsTimes2 = console.draft('...')
  let startTime = Date.now()
  let sent = 0
  let failed = 0
  let time = 0
  let times = {}
  while(1) {
    try {
      let begin = Date.now()
      let ps = [
        match.driver.send(':1;1;0;0'), // :1;1;0;0
        match.driver.send(':1;1;0;0'),
        match.driver.send(':1;1;0;0'),
        match.driver.send(':1;1;0;0'),
        match.driver.send(':1;1;0;0'),
        match.driver.send(':1;1;0;0'),
        match.driver.send(':1;1;0;0'),
        match.driver.send(':1;1;0;0'),
      ]

      // wait all promises
      for (let p of ps) try { 
        sent++
        await p 
      } catch (e) {
        failed++
        // console.log(e)
      }

      time = Date.now() - begin
      times[time] = times[time] ? times[time] + 1 : 1
    } catch (e) {}

    let dropedPercentage = (failed / sent * 100).toFixed(2)
    let pps = ((sent) / ((Date.now() - startTime) / 1000)).toFixed(1)
    
    stats(
      chalk.bgGreen.white(' STATS '),
      chalk.red(`failed: ${failed}\t`),
      chalk.green(`sent: ${sent}\t`),
      chalk.yellow(`${dropedPercentage}%\t`),
      chalk.white(`${time} ms\t`),
      chalk.white(`${pps} packets/s\t`))

    statsTimes1(Object.keys(times))
    statsTimes2(Object.values(times))
    // await match.driver.send(':1;1;40;0')
    // await sleep(500)
    // await match.driver.send(':1;1;0;90')
    // await sleep(1000)
  }
  console.log('front ok')

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

const pasync = {
  all: (ps) => {

  },


}

