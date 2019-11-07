// Math and vetor libs
const Vector = require('../lib/Vector')
const TensorMath = require('../lib/TensorMath')
const Intention = require('../Intention')
const IntentionPlayer = require('./IntentionPlayer')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

const MIN_BASE_LINEAR_SPEED = 300
const AvoidWallDecay = TensorMath.new.constant(1).finish
const AvoidWallSpeed = 980
const AvoidWallCorridorMax = 430
const AvoidWallCorridor = 430
const OffsetBallDistance = 130

module.exports = class NewGoalKeeper extends IntentionPlayer {
  setup () {
    const ball = () => { return this.ball }
    this.orientation = Math.PI / 2
    this.position = {x: 0, y: 40}
    // Defend the goal
    this.$defend = new Intention('defend')
    this.addIntetion(this.$defend)
    // Follow the y of the ball fixed on a x
    this.$defend.addIntetion(new LineIntention('followBallToDefend', {
      target: () => {
        return {x: this.CENTER_OWN_GOAL + 200, y: this.ball.y}
      },
      theta: Vector.direction('right'),
      multiplier: MIN_BASE_LINEAR_SPEED,
      decay: TensorMath.new.mult(-1).finish,
      lineSize: 1700,
      lineDist: 80
    }))
    // Look to the ball
    this.$defend.addIntetion(new LookAtIntention('lookAtBall', {
      target: () => { return {x: this.ball.x - 50, y: this.ball.y} },
      decay: TensorMath.new.finish,
      multiplier: 20
    }))
    // Maintain in the line X of the goal
    this.$defend.addIntetion(new LineIntention('follow_goalline', {
      target: {x: this.CENTER_OWN_GOAL + 200, y: 0},
      theta: Vector.direction('up'),
      lineSize: 1700,
      lineDist: 200,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: MIN_BASE_LINEAR_SPEED + 200
    }))
    // end Defend the goal

    // Repel the Ball
    this.$prepareAttack = new Intention('attackAccelerated')
    this.addIntetion(this.$prepareAttack)
    this.$prepareAttack.addIntetion(new PointIntention('goBall', {
      target: ball,
      radius: OffsetBallDistance * 4,
      radiusMax: OffsetBallDistance * 4,
      decay: TensorMath.new.constant(1).finish,
      multiplier: MIN_BASE_LINEAR_SPEED + 200
    }))
    //  end Repel the Ball

    // Dont go to the sides
    this.$avoidWalls = new Intention()
    this.$avoidWalls.addIntetion(new LineIntention('topWall', {
      target: this.Field.TopRight,
      theta: Vector.direction('left'),
      lineSize: this.Field.width,
      lineSizeSingleSide: true,
      lineDist: AvoidWallCorridor,
      lineDistMax: AvoidWallCorridorMax,
      decay: AvoidWallDecay,
      multiplier: AvoidWallSpeed
    }))
    this.$avoidWalls.addIntetion(new LineIntention('bottomWall', {
      target: this.Field.BottomLeft,
      theta: Vector.direction('right'),
      lineSize: this.Field.width,
      lineSizeSingleSide: true,
      lineDist: AvoidWallCorridor,
      lineDistMax: AvoidWallCorridorMax,
      decay: AvoidWallDecay,
      multiplier: AvoidWallSpeed
    }))
    this.addIntetion(this.$avoidWalls)
    // end Dont go to the sides
    this.ballSpeedInit = this.ballSpeed
  }

  loop () {
    if (this.ball.x < -380) {
      this.$defend.weight = 0
      this.$prepareAttack.weight = 1
      this.$avoidWalls.weight = 0
    } else {
      this.$defend.weight = 1
      this.$prepareAttack.weight = 0
      this.$avoidWalls.weight = 1
    }
  }
}
