const Vector = require('../lib/Vector')
const TensorMath = require('../lib/TensorMath')
const Intention = require('../Intention')
const IntentionPlayer = require('./IntentionPlayer')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

module.exports = class NewAttacker extends IntentionPlayer {
  setup () {
    const ball = () => this.ball
    this.orientation = Math.PI / 2
    this.position = {x: 0, y: 40}

    // Prepare Attack
    this.$prepareAttack = new Intention('prepareAttack')
    this.addIntetion(this.$prepareAttack)

    this.$prepareAttack.addIntetion(new LineIntention('angularAvoidOwnGoal1',
      {
        target: ball,
        theta: Vector.direction('right'),
        lineSize: 400,
        lineSizeSingleSide: true,
        lineDist: 120,
        lineDistMax: 120,
        decay: TensorMath.new.sub(1).mult(-1).finish,
        multiplier: 450
      }
    ))

    this.$prepareAttack.addIntetion(new PointIntention('followBall', {
      target: () => {
        return {x: this.ball.x - 100, y: this.ball.y}
      },
      radius: 400,
      radiusMax: 2000,
      decay: TensorMath.new.finish,
      multiplier: 500
    }))
    // Make Goal
    this.$makeGoal = new Intention('makeGoal')
    this.addIntetion(this.$makeGoal)

    this.$makeGoal = this.addIntetion(new PointIntention('goGoal', {
      target: {x: this.CENTER_ENEMY_GOAL, y: 0},
      radius: 800,
      radiusMax: 2000,
      decay: TensorMath.new.sub(1).mult(-2).finish,
      multiplier: 500
    }))

    this.$makeGoal.addIntetion(new LineIntention('followYBall', {
      target: ball,
      theta: Vector.direction('left'),
      lineSize: 200,
      lineSizeSingleSide: true,
      lineDist: 150,
      multiplier: () => {
        return Vector.size(this.ballSpeed) * 3 + 500
      },
      decay: TensorMath.new.finish
    }))

    this.$pushBall = new Intention('pushBall')
    this.addIntetion(this.$pushBall)

    this.$pushBall = this.addIntetion(new LookAtIntention('lookball', {
      target: ball,
      decay: TensorMath.new.finish,
      multiplier: 10
    }))

    this.$pushBall.addIntetion(new PointIntention('followBall', {
      target: ball,
      radius: 400,
      multiplier: () => {
        return Vector.size(this.ballSpeed) * 2 + 300
      },
      decay: TensorMath.new.finish
    }))

    this.$followBallOnBoarder = new Intention('followBallOnBoarder')
    this.$rules = new Intention('rules')
  }

  loop () {
    let toBall = Vector.sub(this.ball, this.position)
    let toBallAngle = Vector.toDegrees(Vector.angle(toBall))
    let toGoalAngle = Vector.toDegrees(Vector.angle({x: this.CENTER_ENEMY_GOAL, y: this.position.y}))
    let diffBetweenAngles = toGoalAngle + toBallAngle
    let absoluteDiffAngles = Math.abs(diffBetweenAngles)

    if (absoluteDiffAngles < 30) {
      this.$makeGoal.weight = 1
      this.$prepareAttack.weight = 0
      this.$pushBall.weight = 0
      console.log('Inside Make')
    } else if (absoluteDiffAngles >= 30 && absoluteDiffAngles < 60) {
      this.$makeGoal.weight = 0
      this.$prepareAttack.weight = 0
      this.$pushBall.weight = 1
      console.log('Inside Push')
    } else {
      this.$makeGoal.weight = 0
      this.$prepareAttack.weight = 1
      this.$pushBall.weight = 0
      console.log('Inside Prepare')
    }
    if (Math.abs(this.ball.y) > 640) {
      this.$pushBall.weight = 1
    } else {
      this.$pushBall.weight = 0
    }
  }
}
