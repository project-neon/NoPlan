const _ = require('lodash')

module.exports = class RobotWorkers {
  constructor (match, robots) {
    this.match = match
    this.robots = robots
    this.workers = {}
  }

  async init () {
    // Make sure to initialize only once
    if (this.initialized) throw new Error('Cannot re-initialize RobotWorkers')
    this.initialized = true
    // Initialize robots
    for (let id in this.robots) {
      console.log('RobotWorkers', 'start', id)
      await this.start(id, this.robots[id])
    }
    // Bind: Everytime vision detects something, call update inside
    this.match.vision.on('detection', this.update.bind(this))
  }

  // Calls update on all robots
  async update (frame) {
    // Fix position and orientation based on side
    let side = this.match.state.state.side
    frame = this.dataManager.fixFrame(frame, side)
    // Get team color
    let team = this.match.state.state.team
    let robots = frame['robots_' + team]
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
      if (frame) {
        worker.frame = frame
      }
      // Delegate update method to robots
      return worker.update()
    })

    // Wait all promises to finish
    Promise.all(promises).then(data => {
      console.log(data)
      this.match.driver.send(data)
    })
  }

  async start (id, options) {
    if (this.workers[id]) throw new Error('Cannot start process. Process  already running:' + id)
    // Instantiate RobotWorker class
    let worker = new options.class(id, this.match, options)
    // Register worker inside
    this.workers[id] = worker
  }
}
