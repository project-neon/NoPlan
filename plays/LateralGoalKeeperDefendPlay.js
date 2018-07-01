const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

const TensorMath = require('../lib/TensorMath')

const Play = require('./Play')

module.exports = class LateralGoalKeeperDefendPlay extends Play {
	setup_intentions() {
	    let ball = () => {
	      return {x: this.coach.ball.x,
	              y: this.coach.ball.y}
	    }
	}

	constructor(coach) {		
		super(coach)
		this.intentionGroup = new Intention('root_intention')
		this.setup_intentions()
	}
}