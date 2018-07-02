const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

const Vector = require('../lib/Vector')
const TensorMath = require('../lib/TensorMath')

const Play = require('./Play')

const OffsetBallDistance = 130

const MIN_BASE_LINEAR_SPEED = 300
const AvoidWall_Decay = TensorMath.new.constant(1).finish
const AvoidWall_Speed = 980
const AvoidWall_Corridor_max = 430
const AvoidWall_Corridor = 430

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

	    // ============================================ Dont go to the sides
	    this.$avoidWalls = new Intention()
	    this.$avoidWalls.addIntetion(new LineIntention('topWall', {
	      // target: ball,
	      target: this.Field.TopRight,
	      theta: Vector.direction("left"),
	      lineSize: this.Field.width, // Largura do segmento de reta
	      lineSizeSingleSide: true,
	      lineDist: AvoidWall_Corridor, // Tamanho da repelência
	      lineDistMax: AvoidWall_Corridor_max, // Tamanho da repelência
	      // lineDistSingleSide: true,
	      
	      decay: AvoidWall_Decay,
	      multiplier: AvoidWall_Speed,
	    }))

	    this.$avoidWalls.addIntetion(new LineIntention('bottomWall', {
	      // target: ball,
	      target: this.Field.BottomLeft,
	      theta: Vector.direction("right"),
	      lineSize: this.Field.width, // Largura do segmento de reta
	      lineSizeSingleSide: true,

	      lineDist: AvoidWall_Corridor, // Tamanho da repelência
	      lineDistMax: AvoidWall_Corridor_max, // Tamanho da repelência
	      // lineDistSingleSide: true,
	      
	      decay: AvoidWall_Decay,
	      multiplier: AvoidWall_Speed,
	    }))
	    this.intentionGroup.addIntetion(this.$avoidWalls)
	}

	constructor(coach) {		
		super(coach)
		this.intentionGroup = new Intention('root_intention')
		this.setup_intentions()
	}
}