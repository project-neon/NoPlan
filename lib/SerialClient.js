
const _ = require('lodash')
const Readline = require('serialport').parsers.Readline
const SerialPort = require('serialport')
const EventEmitter = require('events')
const inquirer = require('inquirer')

module.exports = class SerialClient extends EventEmitter {
  constructor (options) {
    super()
    this.options = _.defaults(options || {}, {
      baudRate: 115200
    })
    this.port = getPort(this.options['default-port'])
    this.promiseQueue = []
    this._ready = new Deferred()
  }
  get name () {
    return this.port ? this.port.path : 'DISCONNECTED'
  }

  async connect (serialPort) {
    serialPort = await getPort(serialPort)

    // The default is options.port
    serialPort = serialPort || this.port || this.options.port || null
    // If it's connected or connecting, return last promise
    if (this._connect) await this._connect

    // Must know which serialport to connect to
    if (!serialPort || _.isEmpty(serialPort)) throw new Error('No Serial port name or pattern provided')

    // If serialPort is a string, use it as a object {comName: String}
    if (_.isString(serialPort)) serialPort = {comName: serialPort}
    // Try to find port
    let portList = await SerialPort.list()
    let portProp = _.find(portList, serialPort)

    // Reject promise if port not found
    if (!portProp) throw new Error('Port not found: ' + JSON.stringify(serialPort))

    this._connect = new Promise(async (resolve, reject) => {
      try {
        // Open Serial Port
        this.port = new SerialPort(portProp.comName, this.options)

        // Bufferize Line and use as dataReceived
        let lineBuffer = new Readline({delimiter: '\n'})

        // Proxy all data received by serial port to the line Buffer
        this.port.pipe(lineBuffer)

        // Once there's data in line buffer, pass to dataReceived
        lineBuffer.on('data', (data) => {
          this.dataReceived(data)
        })
        // Every time it opens/closes, reset the current queue
        this.port.on('open', () => this.resetQueue())
        this.port.on('close', () => this.resetQueue())
        resolve()
      } catch (e) {
        reject(e)
      }
    })

    await this._connect
  }

  ready () {
    return this._ready.promise
  }

  resetQueue () {
    let promise
    while (promise === this.promiseQueue.shift()) { promise.reject('Connection opening') }
  }

  dataReceived (data) {
    // Skip empty data packets
    if (!data) return
    data = data.toString()
    // Emit data
    this.emit('data', data)
    // Check for start packet
    if (data.startsWith('start')) {
      this.resetQueue()
      return this._ready.resolve()
    }
    if (data.startsWith('ok')) {
      let promise = this.promiseQueue.shift()
      return promise && promise.resolve(data.replace('ok', ''))
    }
    if (data.startsWith('nok')) {
      const promise = this.promiseQueue.shift()
      if (promise) promise.reject(data, data.replace('nok', ''))
      else throw new Error(data)
    }
  }

  async send (data) {
    try {
      let message = ''
      let robotMessage = ''
      // Scan through robot array
      for (var i = 0; i < data.length; i++) {
        let robotId = data[i][0] // Gets robot ID
        let robotState = data[i][1] // Gets robot State
        let linearSpeed = Math.round(data[i][2]) // Gets Linear Speed in Cm/s
        let angularSpeed = Math.round(data[i][3]) // Gets Angular Speed in Degrees/s
        robotMessage = ':' + robotId + ';' + robotState + ';' + linearSpeed + ';' + angularSpeed
        message += robotMessage
      }
      message += ':'
      message += '\n'
      await this.port.write(message)
      // Return a new promise and pushes it to the queue
      let deffered = new Deferred()
      await this.promiseQueue.push(deffered)
      return await deffered.promise
    } catch (e) {
      this.fails = (this.fails + 1) || 1
      if (this.fails > 500) {
        console.error()
        console.error('!!!!!!!!!!! Fails exceeded threshold: 50 !!!!!!!!!!!!')
        console.error()
        this.fails = 0
      }
    }
  }
}

function Deferred () {
  var self = this
  this.promise = new Promise(function (resolve, reject) {
    self.reject = reject
    self.resolve = resolve
  })
}

async function getPort (prefered) {
  let ports = await SerialPort.list()
  let found = _.find(ports, {comName: prefered})
  if (found) { return prefered }

  console.log(`Port '${prefered}' not available`)

  let answer = await inquirer.prompt({
    type: 'list',
    name: 'port',
    choices: _.map(ports, 'comName'),
    message: 'Select Cursor port'
  })

  return answer.port
}
