const _ = require('lodash')
const dataManager = require('./DataManager')

module.exports = class GameManager {
  constructor(match) {
    this.match = match

    this.robotsProperties = this.match.robotsProperties


    this.dataManager = this.match.dataManager

    this.robots = null
    this.coach = null
  }

  async startRobot(id, property) {
      this.robots[id] = {
        radio_id: property.radio_id,
        vision_id: property.vision_id,
        running_play: null,
        robots: {
          self: null,
          teammate: [],
          foes: []
        },
      }
  }

  async init() {
    // Make sure to initialize only once
    // if (this.initialized)
    //   throw new Error('Cannot re-initialize RobotWorkers')
    // this.initialized = true

    // Initialize robots
    this.robots = {}

    this.coach = new this.match.options.coach()

    for (let id in this.robotsProperties) {
      console.log('RobotWorkers', 'start', id)
      await this.startRobot(id, this.robots[id])
    }

    // Bind: Everytime vision detects something, call update inside
    this.dataManager.vision.on('detection', this.update.bind(this))
  }

  // Calls update on all robots
  async update(data) {
    // // Fix position and orientation based on side
    // let side = this.match.state.state.side
    // frame = this.dataManager.fixFrame(frame, side)
    // // Get team color
    // let team = this.match.state.state.team
    // // console.log(side)
    // let robots = frame['robots_' + team]

    this.coach.decide(data, this.robots)

    // Iterare all workers
    let promises = _.values(this.robots).map(robot => {
      // Find specific robot state
      let detection = _.find(this.robots, {robot_id: robot.visionId})
      // Set worker position and orientation
      // if (detection) {
      //   worker.position = {x: detection.x, y: detection.y}
      //   worker.orientation = detection.orientation
      //   worker.detection = detection
      //   worker.active = true
      // } else {
      //   worker.active = false
      // }
      // if (frame) {
      //   worker.frame = frame
      // }
      // Delegate update method to robots
      return worker.update()
    })

    // Wait all promises to finish
    Promise.all(promises).then(data => {
      this.dataManager.driver.send(data)
    })
  }

  async start(id, options) {
    // if (this.workers[id]) {
    //   throw new Error('Cannot start process. Process  already running:' + id)
    // }

    // // Instantiate RobotWorker class
    // let worker = new options.class(id, this.match, options)

    // // Register worker inside
    // this.workers[id] = worker
  }
}
