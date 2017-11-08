
const Vector = require('../lib/Vector')
const TensorMath = require('../lib/TensorMath')

const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')

const BasePlayer = require('./BasePlayer')

const SPEED_IMPORTANCE_MIN=10
const SPEED_IMPORTANCE_MAX=15
const MAX_ROBOT_SPEED=990

const speedImportance = TensorMath.new.map(SPEED_IMPORTANCE_MAX,SPEED_IMPORTANCE_MAX, 0, 1).min(1).max(0).finish

const sleep = ms => new Promise((res, rej) => setTimeout(res, ms))

// const Intentions = {
//   UP: Math.PI / 2,
//   //DOWN: {0},
//   // RIGHT: 0,
//   // LEFT: 0,
// }

function printObj(inp){ 
  let obj = {}
  for (let k in inp) obj[k] = inp[k].toFixed && inp[k].toFixed(1);
  console.log(obj)
}
      
module.exports = class IntentionPlayer extends BasePlayer {
  constructor (id, match, options) {
    super(id, match, options)

    this.intentionGroup = new Intention('RootIntentionGroup')

    this.setup()

    // this.orientation = 0
  }

  addIntetion(intention) {
    this.intentionGroup.addIntetion(intention)
    return intention
  }

  setup() {}
  loop() {}

  computeRobotModelForIntention({vx, vy, vtheta}) {
    // Create Vector From Received Speed
    let targetSpeedVector = {x: vx, y: vy}
    // Escalar
    let targetSpeed = Vector.size(targetSpeedVector)

    // Limit to robot limit
    if (targetSpeed > MAX_ROBOT_SPEED) {
      targetSpeed = MAX_ROBOT_SPEED
      targetSpeedVector = Vector.mult(Vector.norm(targetSpeedVector), MAX_ROBOT_SPEED)
    }

    // Normalize Vector to robot's Xs and Ys
    let robotWorldSpeed = Vector.rotate(targetSpeedVector, -this.orientation)

    // Get linear speed from robotWorldSpeed x component
    let linear = robotWorldSpeed.x

    // To work with the two robot fronts
    if(robotWorldSpeed.x < 0.0) {
      robotWorldSpeed.y = -robotWorldSpeed.y;
      robotWorldSpeed.x = -robotWorldSpeed.x;
    }

    // Use speed vector as robot angle
    let robotAngleToSpeed = -Vector.angle(robotWorldSpeed)

    let speedWeight = speedImportance(targetSpeed)
    let vthetaWeight = 1 - speedWeight
    // console.log(vthetaWeight)

    let angular = (robotAngleToSpeed * 5 * speedWeight) + (vtheta * vthetaWeight)

    return {linear, angular}
  }

  async update() {
    if(this.match.state.state.status == 'stopped'){
      await this.send(0,0,0)
      return
    }

    let frame = this.frame

    // Update ball position
    if(frame.balls[0]){
      this.ball.x = frame.balls[0].x//.x.toFixed(2)
      this.ball.y = frame.balls[0].y//.y.toFixed(2)
    }

    await this.loop()

    // // Prepare input for intentions
    let input = {
      x: this.position.x,
      y: this.position.y,
      theta: this.orientation,
    }

    // // Get intention output
    let output = this.intentionGroup.compute(input)

    // Convert to robot model
    let {linear, angular} = this.computeRobotModelForIntention(output)
    // console.log(angular)

    // Apply to robot
    this.send(1, linear, angular)
  }
}