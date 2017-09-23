const chalk = require('chalk')

const Match = require('./lib/Match')

const players = require('require-smart')('./players')

const PORT = process.env.PORT || 10002
const HOST = process.env.HOST || '224.5.23.2'

const TAG = 'server'
async function startup(){
  console.info(TAG, chalk.yellow('startup'))
  
  let match = new Match({
    vision: { PORT, HOST },
    robots: {
      red: {visionId: 1, radioId: 1, class: players.Attacker}
    },
  })

  await match.init()

  // match.vision.on('data', console.log)

  console.log('Listening in:', PORT)
}

process.on('unhandledRejection', (e) => {
  console.error('Unhandled Rejection')
  console.error(e.stack)
  process.exit(1)
})

startup()


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

