const IntentionPlayer = require('./IntentionPlayer')
const TensorMath = require('../lib/TensorMath')
const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')

const Direction = {
  UP: Math.PI / 2,
  DOWN: -(Math.PI / 2),
  RIGHT: 0,
  LEFT: Math.PI
}

const OffsetBallDistance = 130

const Field = {
  width: 1700,
  TopLeft: {x: -775, y: 675},
  TopRight: {x: 775, y: 675},
  BottomLeft: {x: -775, y: -675},
  BottomRight: {x: 775, y: -675}
}

module.exports = class GoalKeeper extends IntentionPlayer {
  setup () {
    let ball = () => {
      return {x: this.ball.x, y: this.ball.y}
    }
    // Follow Ball in y
    this.$followXIntetion = new Intention('goalkeeper_following')
    this.$followXIntetion.addIntetion(new LineIntention('follow_y', {
      target: ball,
      theta: Direction.RIGHT,
      lineSize: 1700,
      lineDist: 80,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: 900
    }))

    this.$prepareAttack = new Intention('prepareAttack')
    this.addIntetion(this.$prepareAttack)

    this.$keepCenterGoal = new PointIntention('center_goal', {
      target: {x: this.CENTER_OWN_GOAL + 180, y: 0},
      radius: 150,
      radiusMax: false,
      decay: TensorMath.new.constant(1).finish,
      multiplier: 900
    })

    this.$prepareAttack.addIntetion(this.$keepCenterGoal)
    this.$followXIntetion.addIntetion(new LineIntention('follow_goalline', {
      target: {x: this.CENTER_OWN_GOAL + 180, y: 0},
      theta: Direction.UP,
      lineSize: 1700,
      lineDist: 200,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: 900
    }))
    this.addIntetion(this.$followXIntetion)

    // comportamento de libero
    this.$attackAccelerated = new Intention('attackAccelerated')
    this.addIntetion(this.$attackAccelerated)

    this.$attackAccelerated.addIntetion(new PointIntention('goBall', {
      target: ball,
      radius: OffsetBallDistance * 2,
      radiusMax: OffsetBallDistance * 2,
      decay: TensorMath.new.constant(1).finish,
      multiplier: 1200
    }))
  }

  loop () {
    if (this.ball.x > Field.width / 3) {
      this.$followXIntetion.weight = 0
      this.$keepCenterGoal.weight = 1
    } else {
      this.$followXIntetion.weight = 1
      this.$keepCenterGoal.weight = 0
    }
  }
}
