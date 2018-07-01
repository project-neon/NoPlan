const players = require('require-smart')('../players')

module.exports = class Coach {
	constructor(match) {
		this.match = match
		this.frame = null

		this._ballSpeedsRaw = []
		this.ballSpeed = {x: 0, y: 0}
		this.ball = {x: 0, y: 0}

		this.start_positions()
	}

	start_positions() {
		return null
	}

	init() {
	}

	decide_positions(workers) {}

	update(workers, frame) {
		this.frame = frame

		if(this.frame){
		  let frame = this.frame
		  // Update ball position
		  // console.log(frame)
		  if(frame.balls[0]){
		    this.lastBall = this.ball

		    let dt = this.frame.t_capture - this.lastBallTimestamp
		    this.lastBallTimestamp = this.frame.t_capture

		    this.ball = frame.balls[0]

		    if (dt && dt < 0.04 && this.lastBall) {

		      this._ballSpeedsRaw.unshift({
		        x: (this.ball.x - this.lastBall.x) / dt,
		        y: (this.ball.y - this.lastBall.y) / dt,
		      })

		      this._ballSpeedsRaw = this._ballSpeedsRaw.slice(0, 10)

		      let avgSpeed = this._ballSpeedsRaw.reduce((last, speed) => {
		        return {x: last.x + speed.x, y: last.y + speed.y}
		      }, {x: 0, y: 0})

		      avgSpeed.x = avgSpeed.x / this._ballSpeedsRaw.length
		      avgSpeed.y = avgSpeed.y / this._ballSpeedsRaw.length

		      this.ballSpeed = avgSpeed
		    }
		  }

		  this.decide_positions(workers)
		
		} else{
		  console.error("Frame not present in IntentionPlayer")
		}
	}
	
}
