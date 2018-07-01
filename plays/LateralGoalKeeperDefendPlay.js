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

		this.$followXIntetion = new Intention()

	    this.$followXIntetion.addIntetion(new LineIntention('follow_goalline', {
	      target: {x: this.CENTER_OWN_GOAL + 180 , y: 0},
	      theta: this.Direction.UP,
	      lineSize: 1700,
	      lineDist: 200,
	      //lineDistMax: 200,
	      // lineDist: 80,
	      // lineDistMax: 200,
	      decay: TensorMath.new.mult(-1).finish,
	      multiplier: 900,
	    }))

	    this.intentionGroup.addIntetion(this.$followXIntetion)


	   	this.$attackAccelerated = new Intention('attackAccelerated')

	    this.$attackAccelerated.addIntetion(new PointIntention('goBall', {
	      target: ball,
	      radius: this.OffsetBallDistance * 2,
	      radiusMax: this.OffsetBallDistance * 2,
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