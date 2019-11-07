const _ = require('lodash')
const EventEmitter = require('events')
const StateManager = require('./StateManager')
const RobotWorkers = require('./RobotWorkers')

module.exports = class Match {
  constructor (options) {
    this.options = _.defaults(options, {
      driver: {},
      vision: {simulation_step: 0.03},
      robots: {}
    })
    this.state = null
    this.driver = null
    this.vision = null
    this.workers = null
    this.ball = {
      confidence: 0.7377133369445801,
      area: 118,
      x: 0,
      y: 0,
      z: 0,
      pixel_x: 323.2542419433594,
      pixel_y: 387.22882080078125
    }
  }

  async init () {
    if (this.initialized) throw new Error('Cannot re-initialize MatchSimulated')
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

  async initState () {
    this.state = new StateManager({
      status: 'stopped',
      team: 'blue',
      side: 'right'
    })
  }

  async initDriver () {
    this.driver = {
      send: async (robotId, robotState, linearSpeed, angularSpeed) => {}
    }
  }

  async initVision () {
    let simulationStep = this.options.vision.simulation_step || 0.03
    this.vision = new EventEmitter()

    let frame = 0
    let time = 0
    setInterval(() => {
      let robots = this.worker.workers
      let robotPackets = []
      for (let key in robots) {
        let robot = robots[key]
        if (robot.simulate) {
          // Simulate the robot
          robot.simulate(simulationStep)
          // Build robot packet
          robotPackets.push({
            confidence: 1,
            robot_id: robot.visionId,
            x: robot.position.x,
            y: robot.position.y,
            orientation: robot.orientation,
            pixel_x: 0,
            pixel_y: 0
          })
        }
      }

      // Build root packet
      time += simulationStep
      let packet = {
        frame_number: frame++,
        t_capture: time,
        t_sent: time,
        camera_id: 1,
        balls: [
          this.ball
        ],
        robots_yellow: [],
        robots_blue: robotPackets
      }
      // Emit Detection packet
      this.vision.emit('detection', packet)
    }, simulationStep * 1000)
  }

  async initWorkers () {
    this.worker = new RobotWorkers(this, this.options.robots)
    // Wait be ready
    await this.worker.init()
  }
}
