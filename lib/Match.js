const _ = require('lodash')
const SSLVision = require('ssl-vision')

const VSSVision = require('./VSSClient')
const StateManager = require('./StateManager')
const SerialClient = require('./SerialClient')
const RobotWorkers = require('./RobotWorkers')

module.exports = class Match {


  constructor(options) {
    // Match tem que ter uma instancia de GameManager, DataManager, state
    this.options = _.defaults(options, {
      driver: {},
      vision: {},
      coach: {},
      robotsProperties: {}
    })

    this.state = null

    this.dataManager = null
    this.gameManager = null
  }

  async init() {
    if (this.initialized)
      throw new Error('Cannot re-initialize Match')

    this.initialized = true

    console.log('Match init')
    await this.initState()
    console.log('DataManager init')
    await this.initDataManager()
    console.log('GameManager init')
    await this.initGameManager()
    console.log('Finished init')
  }

  async initState() {
    this.state = new StateManager({
      status: 'stopped',
      team: 'blue',
      side: 'left',
    })
  }

  async initGameManager() {
    this.gameManager = new GameManager(this)

    this.gameManager.init()
  }

  async initDataManager() {
    this.dataManager = new DataManager(this)

    this.dataManager.init()
  }

  // async initDriver() {
  //   this.driver = new SerialClient(this.options.driver)
  //   // Wait be ready
  //   await this.driver.connect()
  //   console.log('Waiting driver startup')
  //   await this.driver.ready()
  //   console.log('Startup complete')

  // }

  // async initVision() {
  //   // let options = this.options.vision
  //   // this.vision = new SSLVision(options.HOST, options.PORT)
  //   // // Wait be ready
  //   // await this.vision.connect()

  //   this.vision = new VSSVision('localhost', options.PORT)
  //   await this.vision.connect()
  // }

  // async initWorkers() {
  //   this.worker = new RobotWorkers(this, this.options.robots)
  //   // Wait be ready
  //   await this.worker.init()
  // }

  // async initSocket() {
  //   this.socket = new Socket()
  // }
}
