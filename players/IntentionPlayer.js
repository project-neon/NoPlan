
const Vector = require('../lib/Vector')
const TensorMath = require('../lib/TensorMath')

const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')

const BasePlayer = require('./BasePlayer')

let MAX_SPEED=999

const sleep = ms => new Promise((res, rej) => setTimeout(res, ms))

// const Intentions = {
//   UP: Math.PI / 2,
//   //DOWN: {0},
//   // RIGHT: 0,
//   // LEFT: 0,
// }


module.exports = class IntentionPlayer extends BasePlayer {
  constructor (id, match, options) {
    super(id, match, options)

    this.intentionGroup = new Intention('RootIntentionGroup')

    this.setup()
  }

  setup() {}
  loop() {}

  computeRobotModelForIntention({vx, vy, vtheta}) {

    let robotThetaVector = Vector.fromTheta(this.orientation)
    let targetSpeedVector = {x: vx, y: vy}

    let robotWorldSpeed = Vector.rotate(targetSpeedVector, -this.orientation)

    // 50% de chance de dar certo
    let linear = robotWorldSpeed.y


    if(robotWorldSpeed.y < 0.0) {
      robotWorldSpeed.y = -robotWorldSpeed.y;
      robotWorldSpeed.x = -robotWorldSpeed.x;
    }

    let robotAngleToSpeed = Vector.angle(robotWorldSpeed)//Vector.angleBetween(robotThetaVector, targetSpeedVector)
    let angular = robotAngleToSpeed * 3

    // console.log(vx, vy, vtheta, Vector.toDegrees(this.orientation).toFixed(2), targetSpeedVector)
    // console.log({x:robotWorldSpeed.x.toFixed(2), y: robotWorldSpeed.y.toFixed(2)})
    return {linear, angular}
  }

  async update() {
    if(this.match.state.state.status == 'stopped'){
      await this.send(0,0,0)
      return
    }

    // this.draft = this.draft || console.draft()

    let frame = this.frame

    // Update ball position
    if(frame.balls[0]){
      this.ball.x = frame.balls[0].x.toFixed(2)
      this.ball.y = frame.balls[0].y.toFixed(2)
    }

    await this.loop()

    // // Prepare input for intentions
    let input = {
      x: this.position.x,
      y: this.position.y,
      theta: this.orientation
    }

    // // Get intention output
    let output = this.intentionGroup.compute(input)

    //console.log(input, output)

    // let output = {
    //   vx: 700,
    //   vy: 0,
    //   // vx: 500 * ((Math.round(Date.now() / 5000) % 2) * 2 - 1),
    //   // vy: 500 * ((Math.round((Date.now() - 2500) / 5000) % 2) * 2 - 1), 
    //   vtheta: Math.PI,
    // }

    // Convert to robot model
    let {linear, angular} = this.computeRobotModelForIntention(output)
    // console.log(angular)

    // Apply to robot
    this.send(1, linear, angular)
    
    // if (frame) {

    //   let ball = Vector.sub(this.ball, this.position)
    //   let robot = Vector.fromTheta(this.orientation)
    //   let angle = Vector.angleBetween(ball, robot)
    //   let targetSpeed = Vector.toDegrees(angle)
    //   // this.draft(Math.round(targetSpeed))
    //   // targetSpeed = targetSpeed > 10 ? 360 : targetSpeed < -10 ? -360 : targetSpeed * 30

    //   // await this.send(1,0,Vector.toRadians(targetSpeed))
    //   let speedFront = -Math.max(0, 400 - Math.abs(angle * 100)) 
    //   await this.send(1, speedFront,angle * 5)

    // }
  }
}