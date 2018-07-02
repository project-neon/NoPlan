const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

const TensorMath = require('../lib/TensorMath')

const Play = require('./Play')

module.exports = class GoalKeeperDefendPlay extends Play {
	setup_intentions() {
	    let ball = () => {
	      return {x: this.coach.ball.x,
	              y: this.coach.ball.y}
	    }

	    const OffsetBallDistance = 130

	    this.$keepCenterGoal = new PointIntention('center_goal', {
	      target: {x: this.CENTER_OWN_GOAL + 180, y: 0},
	      radius: 150,
	      radiusMax: false,
	      decay: TensorMath.new.constant(1).finish,
	      multiplier: 500,
	    })

	    this.intentionGroup.addIntetion(this.$keepCenterGoal)
	}

	constructor(coach) {		
		super(coach)
		this.intentionGroup = new Intention('root_intention')
		this.setup_intentions()
	}
}