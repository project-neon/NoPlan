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
      radioId: property.radio_id,
      visionId: property.vision_id,
      runningPlay: null,
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
    for (let id in this.robotsProperties) {
      console.log('RobotWorkers', 'start', id)
      await this.startRobot(id, this.robotsProperties[id])
    }

    this.coach = new this.match.options.coach({match: this.match})

    // Bind: Everytime vision detects something, call update inside
    this.dataManager.on('detection', this.update.bind(this))
  }

  // Calls update on all robots
  async update(data) {
    // // Fix position and orientation based on side
    let side = this.match.state.state.side
    data = this.dataManager.fixFrame(data, side)
    // Get team color
    let team = this.match.state.state.team
    // console.log(side)
    let robots_pos = data['robots_' + team]
    await this.coach.decide(data, this.robots)
    // Iterare all workers
    let promises = _.values(this.robots).map(robot => {
      // Find specific robot state
      let detection = _.find(robots_pos, {robot_id: robot.visionId})
      // Set worker position and orientation
      if (detection) {
        robot.runningPlay.position = {x: detection.x, y: detection.y}
        robot.runningPlay.orientation = detection.orientation
        robot.runningPlay.detection = detection
        robot.runningPlay.active = true
      } else {
        robot.runningPlay.active = false
      }
      if (data) {
        robot.runningPlay.frame = data
      }
      // Delegate update method to robots
      return robot.runningPlay.update()
    })

    // Wait all promises to finish
    Promise.all(promises).then(data => {
      this.dataManager.driver.send(data)
    })
  }


}
