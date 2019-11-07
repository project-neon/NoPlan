const dgram = require('dgram')
const EventEmitter = require('events')

module.exports = class VSSVision extends EventEmitter {

  constructor(HOST, PORT, dataManager) {
    super()
    this.robotPackets
    this.dataManager = dataManager
    this.data = null
    this.frame = 0
    this.time = 0
    this.ball = {
        confidence: 1,
        area: 120,
        x: 0,
        y: 0,
        z: 0,
        pixel_x: 323.2542419433594,
        pixel_y: 387.22882080078125
    }
  }

  connect () {
    return new Promise((resolve, reject) => {})
  }

  _init() {
    let simulation_step = 0.03
    setInterval(() => {
        let robots = this.dataManager.match.gameManager.robots
        for (let key in robots) {
            let robot = robots[key]
            // if (robot.simulate) {
            // Simulate the robot
            robot.running_play.simulate(simulation_step)

            // Build robot packet
            this.robotPackets.push({
            confidence: 1,
            robot_id: robot.visionId,
            x: robot.robots.self['position'].position.x,
            y: robot.robots.self['position'].position.y,
            orientation: robot.robots.self['position'].orientation,
            pixel_x: 0,
            pixel_y: 0
            })
            // }
        }
        this.time += simulation_step
        let packet = {
          frame_number: this.frame++,
          t_capture: this.time,
          t_sent: this.time,
          camera_id: 1,
          balls: [
              this.ball
            ],
            robots_yellow: [],
            robots_blue: this.robotPackets,
        }

        this._message(packet)
      }, simulation_step * 1000)
    }

  _bind() {
  }

  _message(data) {
    try {
      this.data = JSON.parse(data.toString())

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
