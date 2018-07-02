const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

const TensorMath = require('../lib/TensorMath')

const Play = require('./Play')

const OffsetBallDistance = 130

module.exports = class LateralGoalKeeperDefendPlay extends Play {
	setup_intentions() {
	    let ball = () => {
	      return {x: this.coach.ball.x,
	              y: this.coach.ball.y}
	    }

		this.$followXIntetion = new Intention()

	    this.$followXIntetion = new PointIntention('lateral_ball_following', {
	      target: () => { return {x: this.CENTER_OWN_GOAL + 180, y: this.coach.ball.y}},
	      radius: 150,
	      radiusMax: false,
	      decay: TensorMath.new.constant(1).finish,
	      multiplier: 500,
	    })

	    this.intentionGroup.addIntetion(this.$followXIntetion)
	}

	constructor(coach) {		
		super(coach)
		this.intentionGroup = new Intention('root_intention')
		this.setup_intentions()
	}
}