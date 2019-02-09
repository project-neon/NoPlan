const _ = require('lodash')
const SSLVision = require('ssl-vision')

const VSSVision = require('./VSSClient')
const StateManager = require('./StateManager')
const VSSSerialClient = require('./VSSserialClient')
const RobotWorkers = require('./RobotWorkers')

module.exports = class Match {
  constructor(options) {
    this.options = _.defaults(options, {
      driver: {},
      vision: {},
      robots: {},
    })

    this.state = null
    this.driver = null
    this.vision = null
    this.workers = null
  }

  async init() {
    if (this.initialized)
      throw new Error('Cannot re-initialize Match')

    this.initialized = true

    console.log('Match init')
    await this.initState()
    console.log('Driver init')
    await this.initDriver()
    console.log('Vision init')
    await this.initVision()
    console.log('Workers init')
    await this.initWorkers()
    console.log('Finished init')
  }

  async initState() {
    this.state = new StateManager({
      status: 'stopped',
      team: 'yellow',
      side: 'left',
    })
  }

  async initDriver() {
    this.driver = new VSSSerialClient({PORT: 5778, HOST: 'localhost'})
  }

  async initVision() {
    this.vision = new VSSVision('localhost', 5777)
    await this.vision.connect()
  }

  async initWorkers() {
    this.worker = new RobotWorkers(this, this.options.robots)
    // Wait be ready
    await this.worker.init()
  }

  async initSocket() {
    this.socket = new Socket()
  }
}
