const Vector = require('../lib/Vector')
const TensorMath = require('../lib/TensorMath')
const Intention = require('../Intention')
const IntentionPlayer = require('./IntentionPlayer')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')

const AvoidWallDecay = TensorMath.new.mult(-1).sum(1).finish
const AvoidWallSpeed = 100
const AvoidWallCorridor = 200
const OffsetBallDistance = 75

const Direction = {
  UP: Math.PI / 2,
  DOWN: -(Math.PI / 2),
  RIGHT: 0,
  LEFT: Math.PI
}
const Field = {
  width: 1700,
  TopLeft: {x: -775, y: 675},
  TopRight: {x: 775, y: 675},
  BottomLeft: {x: -775, y: -675},
  BottomRight: {x: 775, y: -675}
}

module.exports = class Attacker extends IntentionPlayer {
  setup () {
    const ball = this.ball

    this.orientation = Math.PI / 2
    this.position = {x: 0, y: 40}

    // Avoid Robots
    this.$avoidRobots = new Intention('avoidRobots')
    this.addIntetion(this.$avoidRobots)

    // Avoid Walls
    this.$avoidWalls = new Intention('avoidWalls')
    this.addIntetion(this.$avoidWalls)

    this.$avoidWalls.addIntetion(new LineIntention('topWall', {
      target: Field.TopLeft,
      theta: Direction.RIGHT,
      lineSize: Field.width,
      lineDist: AvoidWallCorridor,
      lineDistMax: AvoidWallCorridor,
      decay: AvoidWallDecay,
      multiplier: AvoidWallSpeed
    }))
    this.$avoidWalls.addIntetion(new LineIntention('bottomWall', {
      target: Field.BottomRight,
      theta: Direction.LEFT,
      lineSize: Field.width,
      lineDist: AvoidWallCorridor,
      lineDistMax: AvoidWallCorridor,
      decay: AvoidWallDecay,
      multiplier: AvoidWallSpeed
    }))

    // Prepare Attack
    this.$prepareAttack = new Intention('prepareAttack')
    this.addIntetion(this.$prepareAttack)

    this.$prepareAttack.addIntetion(new LineIntention('avoidBallOwnGoal', {
      target: ball,
      theta: Direction.DOWN,
      lineSize: 50,
      lineDist: 180,
      lineDistMax: 180,
      lineDistSingleSide: true,
      decay: TensorMath.new.mult(-1).sum(1).finish,
      multiplier: 700
    }))

    this.$prepareAttack.addIntetion(new LineIntention('openBallSpaceFromOtherSide', {
      target: ball,
      theta: Direction.RIGHT,
      lineSize: 350,
      lineSizeSingleSide: true,
      lineDist: 250,
      lineDistMax: 250,
      decay: TensorMath.new.mult(-1).sum(1).finish,
      multiplier: 600
    }))

    this.$prepareAttack.addIntetion(new PointIntention('followBall', {
      target: () => {
        return {x: this.ball.x - OffsetBallDistance, y: this.ball.y}
      },
      radius: 150,
      radiusMax: false,
      decay: TensorMath.new.finish,
      multiplier: 700
    }))

    // Rules
    this.$rules = new LineIntention('avoid_defence_fault', {
      target: {x: -850, y: 0},
      theta: Direction.UP,
      lineSize: 100000,
      lineDist: 650,
      lineDistMax: 650,
      decay: TensorMath.new.mult(-1).sum(1).finish,
      multiplier: 2200
    })
    this.addIntetion(this.$rules)

    this.$attackAccelerated = this.addIntetion(new PointIntention('goBall', {
      target: () => {
        return {x: this.ball.x, y: this.ball.y}
      },
      radius: OffsetBallDistance + 150,
      radiusMax: OffsetBallDistance + 150,
      decay: TensorMath.new.constant(1).finish,
      multiplier: this.currentAttackMultiplier.bind(this)
    }))

    this.$goGoal = this.addIntetion(new PointIntention('goGoal', {
      target: {x: 800, y: 30},
      radius: 150,
      radiusMax: false,
      decay: TensorMath.new.finish,
      multiplier: 800
    }))
  }

  currentAttackMultiplier () {
    let speed = Math.max(260, Vector.size(this.ballSpeed) * 2.0 + 260)
    return speed
  }

  loop () {
    let toBall = Vector.sub({x: this.ball.x, y: this.ball.y}, this.position)
    let toBallDist = Vector.size(toBall)
    let toBallAngle = Vector.toDegrees(Vector.angle(toBall))
    let withinAttackArea = (toBall.x > 0) && Math.abs(toBallAngle) < (35) // 35

    if (!withinAttackArea) {
      this.$prepareAttack.weight = 1
      this.$attackAccelerated.weight = 0
      this.$goGoal.weight = 0
    } else {
      this.$prepareAttack.weight = 0.5
      this.$attackAccelerated.weight = 1
      if (toBallDist > 300 || (toBallDist < 120 && this.ballSpeed.x > 300)) {
        this.$goGoal.weight = 1
      } else {
        this.$goGoal.weight = 0
      }
      this.$avoidWalls.weight = 0.3
    }
  }
}
