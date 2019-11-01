
const _ = require('lodash')

const dgram = require('dgram')
const EventEmitter = require('events')

module.exports = class SerialClient extends EventEmitter {
  constructor (options) {
    super()
    this.options = _.defaults(options || {}, {
      PORT: 5778,
      HOST: 'localhost'
    })

    this.PORT = this.options.PORT
    this.HOST = this.options.HOST
    this.client = null
  }

  async connect (serialPort) {
    this.client = dgram.createSocket('udp4')
  }

  async send (data) {
    this.data = Buffer.from(JSON.stringify(data))
    this.client.send(this.data, this.PORT, this.HOST)
  }
}
