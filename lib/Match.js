const _ = require('lodash')
const StateManager = require('./StateManager')
const DataManager = require('./DataManager')
const GameManager = require('./GameManager')

module.exports = class Match {
  constructor (options) {
    // Match tem que ter uma instancia de GameManager, DataManager, state
    this.options = _.defaults(options, {
      driver: {},
      vision: {},
      coach: {},
      robotsProperties: {}
    })

    this.state_ = null
    this.dataManager = null
    this.gameManager = null
    this.robotsProperties = options.robotsProperties
  }

  async init () {
    if (this.initialized) throw new Error('Cannot re-initialize Match')
    this.initialized = true
    console.log('Match init')
    await this.initState()
    console.log('DataManager init')
    await this.initDataManager()
    console.log('GameManager init')
    await this.initGameManager()
    console.log('Finished init')
  }

  async initState () {
    this.state = new StateManager({
      status: 'stopped',
      team: 'blue',
      side: 'left'
    })
  }

  async initGameManager () {
    this.gameManager = new GameManager(this)
    this.gameManager.init()
  }

  async initDataManager () {
    this.dataManager = new DataManager(this)
    this.dataManager.init()
  }
}
