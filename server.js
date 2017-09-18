const chalk = require('chalk')

const Match = require('./lib/Match')

const players = require('require-smart')('./players')

const TAG = 'server'
async function startup(){
  console.info(TAG, chalk.yellow('startup'))
  
  let match = new Match({
    vision: {
      PORT: 10002,
    },
    robots: {
      red: {visionId: 1, radioId: 1, class: players.Attacker}
    },
  })

  await match.init()
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

