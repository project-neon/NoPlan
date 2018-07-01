const _ = require('lodash')

module.exports = class RobotWorkers {
  constructor(match, robots, coach) {
    this.match = match
    this.robots = robots
    this.coach = new coach(this)
    this.workers = {}
  }

  toObject() {
    return _.mapValues(this.workers, worker => {
      return worker.toObject()
    })
  }

  async init() {
    // Make sure to initialize only once
    if (this.initialized)
      throw new Error('Cannot re-initialize RobotWorkers')
    this.initialized = true

    // Initialize robots
    for (let id in this.robots) {
      console.log('RobotWorkers', 'start', id)
      await this.start(id, this.robots[id])
    }
    this.coach.init()
    // Bind: Everytime vision detects something, call update inside
    this.match.vision.on('detection', this.update.bind(this))
  }

  // Calls update on all robots
  async update(frame) {
    // Get team color
    let side = this.match.state.state.team
    // console.log(side)
    let robots = frame['robots_' + side]
    
    this.coach.update(this.workers, frame)

    // Iterare all workers
    let promises = _.values(this.workers).map(worker => {
      // Find specific robot state
      let detection = _.find(robots, {robot_id: worker.visionId})

      // Set worker position and orientation
      if (detection) {
        worker.position = {x: detection.x, y: detection.y}
        worker.orientation = detection.orientation
        worker.detection = detection
        worker.active = true
      } else {
        worker.active = false
      }

      worker.ball = this.coach.ball || worker.ball
      worker.ballSpeed = this.coach.ballSpeed || worker.ballSpeed

      if (frame) {
        worker.frame = frame
      }

      // Delegate update method to robots
      return worker.update()
    })

    // Wait all promises to finish
    await Promise.all(promises)
  }

  async start(id, options) {
    if (this.workers[id]) {
      throw new Error('Cannot start process. Process  already running:' + id)
    }

    // Instantiate RobotWorker class

    // Coach decides each of the position classes will be instantiated
    // this will be needed to avoid run the setup of intentionPlayer a lot of times
    // in update of RobotWorkers coach will assign the correct player class
    // for each of the robots based on global match data.

    let worker = new options.class(id, this.match, options)
    // Register worker inside
    this.workers[id] = worker
  }
}