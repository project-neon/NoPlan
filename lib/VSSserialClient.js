
const _ = require('lodash')
const EventEmitter = require('events')
const dgram = require('dgram')


module.exports = class VSSSerialClient extends EventEmitter{
  constructor (options) {
    super()

    this.HOST = options.HOST || 'localhost'
    this.PORT = options.PORT || 5778

    this.client = dgram.createSocket('udp4')
  }

  async ready() {}

  async connect (serialPort) {}

  async send(data) {
      data = Buffer.from(JSON.stringify(data))
      this.client.send(data, this.PORT, this.HOST)
  }
}

function Deferred() {
  var self = this;
  this.promise = new Promise(function(resolve, reject) {
    self.reject = reject
    self.resolve = resolve
  })
}
