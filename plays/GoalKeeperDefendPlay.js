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

	    this.$attackAccelerated = new Intention('attackAccelerated')

	    this.$attackAccelerated.addIntetion(new PointIntention('goBall', {
	      target: ball,
	      radius: OffsetBallDistance * 2,
	      radiusMax: OffsetBallDistance * 2,
	      decay: TensorMath.new.constant(1).finish,
	      multiplier: 1200,
	    }))

    	this.intentionGroup.addIntetion(this.$attackAccelerated)
	}

	constructor(coach) {		
		super(coach)
		this.intentionGroup = new Intention('root_intention')
		this.setup_intentions()
	}
}