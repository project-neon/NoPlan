
const _ = require('lodash')

const EventEmitter = require('events')

module.exports = class SerialClient extends EventEmitter {
  constructor (options) {
    super()
  }

  async ready() {}

  async connect (serialPort) {}

  async send (data) {
      console.log(data)
  }
}
