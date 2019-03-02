const _ = require('lodash')
const EventEmitter = require('events')

module.exports = class DataManager extends EventEmitter{
  constructor(match) {
		super()
    this.match = this
    this.robots = null
    this.coach = null
    this.visionParams = match.options.vision.params
    this.driverParams = match.options.driver.params
  }

  async init () {
    this.vision = require(this.visionParams.class)
    this.driver = require(this.driverParams.class)

    this.vision = new this.vision(this.visionParams.host, this.visionParams.port)
		this.driver = new this.driver(this.driverParams)

		this.vision.connect()

		this.driver.connect(this.driverParams['default-port'])
		this.driver.ready()

		this.vision.on('detection', this.emitVision.bind(this))
	}
	
	emitVision (frame) {
		let data = this.fixFrame(frame, this.match.state.state.side)

		this.emit('detection', data)
	}

	fixFrame(frame, side) {
		// Fix position and orientation from robots and ball:
		// Position just multiply by -1 (since the center of the field is the origin)
		// Orientation just sum PI (a 180 degrees rotation)
		if(side == 'left') {
			let yellow_team = frame['robots_yellow']
			let blue_team = frame['robots_blue']
			let balls = frame['balls']

			if (blue_team.length > 0) {
				for(let robot in blue_team) {
					blue_team[robot]['x'] *= -1
					blue_team[robot]['y'] *= -1
					blue_team[robot]['orientation'] += Math.PI
				}
			}
			if (yellow_team.length > 0) {
				for(let robot in yellow_team) {
					yellow_team[robot]['x'] *= -1
					yellow_team[robot]['y'] *= -1
					yellow_team[robot]['orientation'] += Math.PI
				}
			}

			if (balls.length > 0) {
				for(let ball in balls) {
					balls[ball]['x'] *= -1
					balls[ball]['y'] *= -1
				}
			}

			frame['robots_yellow'] = yellow_team
			frame['robots_blue'] = blue_team
			frame['balls'] = balls
		}

		return frame
	}
}