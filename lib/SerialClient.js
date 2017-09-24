const _ = require('lodash')
const chalk = require('chalk')
const Readline = require('serialport').parsers.Readline
const SerialPort = require('serialport')
const EventEmitter = require('events')

module.exports = class SerialClient extends EventEmitter{
  constructor (options) {
    super()

    this.options = _.defaults(options || {}, {
      baudRate: 115200,
    })

    this.promiseQueue = []

    this._ready = new Deferred()
  }
  get name(){
    return this.port ? this.port.path : 'DISCONNECTED'
  }

  async connect (serialPort) {
    
    // The default is options.port
    serialPort = serialPort || this.options.port || null

    // If it's connected or connecting, return last promise
    if(this._connect){
      return await this._connect
    }

    // Must know which serialport to connect to
    if (!serialPort || _.isEmpty(serialPort)){
      throw new Error('No Serial port name or pattern provided')
    }

    // If serialPort is a string, use it as a object {comName: String}
    if(_.isString(serialPort)){
      serialPort = {comName: serialPort}
    }else{
      serialPort = serialPort
    }

    //Try to find port
    let portList = await SerialPort.list()
    let portProp = _.find(portList, serialPort)

    //Reject promise if port not found
    if (!portProp){
      throw new Error('Port not found: '+JSON.stringify(serialPort))
    }

    this._connect = new Promise(async(resolve, reject) => {
      try{
        //Open Serial Port
        console.log(this.options)
        this.port = new SerialPort(portProp.comName, this.options)

        //Bufferize Line and use as dataReceived
        let lineBuffer = new Readline({delimiter: '\n'})

        //Proxy all data received by serial port to the line Buffer
        this.port.pipe(lineBuffer)
        //Once there's data in line buffer, pass to dataReceived
        lineBuffer.on('data', (data) => this.dataReceived(data))
        //Every time it opens/closes, reset the current queue
        this.port.on('open', () => this.resetQueue())
        this.port.on('close', () => this.resetQueue())
        resolve()
      } catch (e) {
        reject(e)
      }
    })

    await this._connect
  }

  ready(){
    return this._ready.promise
  }

  resetQueue(){
    let promise
    while(promise = this.promiseQueue.shift())
      promise.reject('Connection opening')
  }

  dataReceived(data){
    //Skip empty data packets
    if(!data)
      return

    //Debug in console if flag set
    if (this.options.debug) {
      // console.log('<', new Buffer(data))
      console.log('<', data)
    }

    // Make sure it's a string
    data = data.toString()

    // Emit data
    this.emit('data', data)

    // Check for start packet
    if (data.startsWith('start')) {
      this.resetQueue()
      return this._ready.resolve()
    }

    if(data.startsWith('ok')){
      let promise = this.promiseQueue.shift()
      
      return promise && promise.resolve(data.replace('ok', ''))
    }

    if(data.startsWith('nok')){
      let promise = this.promiseQueue.shift()

      if (promise)
        promise.reject(data, data.replace('nok', ''))
      else 
        throw new Error(data)
    }
  }

  send(command) {
     if (this.options.debug)
      console.log('>', command)

    // Combine with nl and cr
    command += '\n'

    // Write to serial port
    // console.log(') ', command.replace(/\n/g, chalk.yellow('\\n')).replace(/\r/g, chalk.yellow('\\r')))
    this.port.write(command)

    // Return a new promise and pushes it to the queue
    let deffered = new Deferred()
    this.promiseQueue.push(deffered)

    return deffered.promise
  }
}

function Deferred() {
  var self = this;
  this.promise = new Promise(function(resolve, reject) {
    self.reject = reject
    self.resolve = resolve
  })
}