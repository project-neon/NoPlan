const _ = require('lodash')
const EventEmitter = require('events')
const Vector = require('./Vector')

module.exports = class DataManager extends EventEmitter{
  constructor(match) {
		super()

    this.match = match
    this.robots = null
		this.coach = null
		
		this.frameHistory = {
			size: 15,
			frames: []
		}
		 
    // this.vision = vision.impl
    // this.driver = driver.impl
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
		let data = frame
		// let data = this.fixFrame(frame, this.match.state._state.side)
		this.updateFrameHistory(frame)
		console.log('speed: ', this.calculateBallSpeed())
		this.emit('detection', data)
	}

	updateFrameHistory (frame) {
		if (frame.balls.length === 0) return
		// Ponto final no cálculo do vetor é a primeira posição do array
		if (this.frameHistory.frames.length === this.frameHistory.size) {
			this.frameHistory.frames.pop()
			this.frameHistory.frames.unshift(frame)
		} else {
			this.frameHistory.frames.unshift(frame)
		}
		//1551562891.27858 - 1551562891.246445/

	}
	calculateBallSpeed () {
		if (this.frameHistory.frames.length <= 1) return 
		let zip = (rows) => rows[0].map((_,c) => rows.map(row => row[c]))
		
		let clone = (obj) => {
			if (null == obj || "object" != typeof obj) return obj
			var copy = obj.constructor()
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr]
			}
			return copy
		}
		let frameHistoryShifted = clone(this.frameHistory.frames)
		frameHistoryShifted.shift()
		let zipFrames = zip([this.frameHistory.frames, frameHistoryShifted])
		zipFrames.pop()

		const direction = Vector.norm({
			x: (zipFrames[0][0].balls[0].x + 10000) - (zipFrames[0][1].balls[0].x + 10000),
			y: (zipFrames[0][0].balls[0].y + 10000) - (zipFrames[0][1].balls[0].y + 10000)
		})

		let speeds = []
		for (let pairs in zipFrames) {
			// pairs[0]
			// pairs[1]
			let ballPosF = {
				x: zipFrames[pairs][0].balls[0].x,
				y: zipFrames[pairs][0].balls[0].y
			}
			let ballPosI = {
				x: zipFrames[pairs][1].balls[0].x,
				y: zipFrames[pairs][1].balls[0].y
			}

			const deltaPos = Math.abs(
				Math.sqrt(Math.pow(ballPosF.x - ballPosI.x, 2) + Math.pow(ballPosF.y - ballPosI.y, 2))
			)

			let frameTimeF = zipFrames[pairs][0].t_capture
			let frameTimeI = zipFrames[pairs][1].t_capture
			const deltaTime = (frameTimeF - frameTimeI)*10 //to Seconds
			const speed = deltaPos/deltaTime // [mm/s]
			speeds.push(speed)
		}
		speeds.shift()
		const finalSpeed = speeds.reduce(function(a, b) { return a + b; }, 0) / speeds.length

		return {
			x: direction.x * finalSpeed,
			y: direction.y * finalSpeed
		}
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
