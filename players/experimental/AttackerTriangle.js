const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const Intention = require('../../Intention')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const OrbitalIntention = require('../../Intention/OrbitalIntention')
const Vector = require('../../lib/Vector')
const RulePlays = require('./RulePlays')

const BASE_SPEED = 70

module.exports = class AttackerTriangle extends RulePlays {
  setup () {
  super.setup()

  let ball = () => {
    return {
        x: this.frame.cleanData.ball.x,
        y: this.frame.cleanData.ball.y
    }
  }

  let ballToGoalNormal = () => {
    let b = this.frame.cleanData.ball
    let c = {x: 680, y: 0}

    let ballToGoal = Vector.sub(b, c)

    // Vector normal
    ballToGoal = Vector.norm({x: ballToGoal.x, y: -ballToGoal.y})

    return Vector.angle(ballToGoal)
}

const ballToGoal = () => {
  let b = this.frame.cleanData.ball
  let c = {x: 680, y: 0}

  return Vector.angle(Vector.sub(b, c))
}

this.addIntetion(new LineIntention('To the goal', {
  target: ball,
  theta: ballToGoalNormal,
  lineSize: 150,
  lineDist: 200,
  lineDistMax: 200,
  decay: TensorMath.new.finish,
  multiplier: BASE_SPEED,
  lineDistSingleSide: true
}))

this.addIntetion(new LineIntention('Keep eye on goal', {
  target: ball,
  theta: ballToGoal,
  lineSize: 2000,
  lineDist: 200,
  lineDistMax: 200,
  decay: TensorMath.new.finish,
  multiplier: BASE_SPEED * 1.2
}))

  this.addIntetion(new PointIntention('goBall', {
    target: ball,
    radius: 150,
    decay: TensorMath.new.finish,
    multiplier: BASE_SPEED,
  }))

}
loop(){
}
}
