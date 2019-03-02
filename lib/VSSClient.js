const dgram = require('dgram')
const EventEmitter = require('events')

module.exports = class VSSClient extends EventEmitter {

  constructor(HOST, PORT) {
    super()

    this.HOST = HOST || 'localhost'
    this.PORT = PORT || 5777
    this.client = null

    // Public state variables
    this.data = null
  }

  connect () {
    return new Promise((resolve, reject) => {
      if (this.client) {
        throw new Error('Client is already open. Close the connection first')
      }

      // Create Client
      this.client = dgram.createSocket('udp4')

      // Bind message
      this._bind()

      // Wait to bind
      this.client.bind(this.PORT, this.HOST, () => {
        // Initialize connection
        this._init()

        // Resolve
        resolve()
      })
    })
  }

  _init() {
    var address = this.client.address()
  }

  _bind() {
    this.client.on('message', this._message.bind(this))
  }

  _message(data, remote) {
    try {
      this.data = JSON.parse(data.toString('utf8'))
      // Skip if frame is null
      if (!this.data)
        return

      // Emit data
      this.emit('data', this.data)

      // Emit detection only if set
      if (this.data.detection)
        this.emit('detection', this.data.detection)

      // Emit geometry only if set
      if (this.data.geometry)
        this.emit('geometry', this.data.geometry)
    } catch (e) {
      this.emit('error', e)
    }
  }
}
