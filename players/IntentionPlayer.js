//  Math and vector libs
const Vector = require('../lib/Vector')
const TensorMath = require('../lib/TensorMath')

// Intentions libs
const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')

// Base player lib
const BasePlayer = require('./BasePlayer')

module.exports = class IntentionPlayer extends BasePlayer {
  constructor (id, match, options) {
    super(id, match, options)
    // Constants

    // Position of Field Edges
    this.Field = {
      width: 1700,
      TopLeft: {x: -775, y: 675},
      TopRight: {x: 775, y: 675},
      BottomLeft: {x: -775, y: -675},
      BottomRight: {x: 775, y: -675}
    }

    // Util function to sleep
    this.sleep = ms => new Promise((res, rej) => setTimeout(res, ms))

    // The Offset between the real ball position and the position that robot will follow
    this.AtkOffsetBallDistance = 150

    // Centers of your own goal and enemy goal
    this.CENTER_OWN_GOAL = -835
    this.CENTER_ENEMY_GOAL = 835

    // Self-explanatory
    this.MAX_ROBOT_SPEED=500

    this.SPEED_IMPORTANCE_MAX=15

    this.speedImportance = TensorMath.new.map(
      this.SPEED_IMPORTANCE_MAX,this.SPEED_IMPORTANCE_MAX, 0, 1).min(1).max(0).finish
    // =======================
    this.intentionGroup = new Intention('RootIntentionGroup')
    
    this.lastBall = null
    this.ballSpeed = {x: 0, y: 0}
    this._ballSpeedsRaw = []

    this.setup()

    // Avoid other goal
    this.addIntetion(new LineIntention('avoidOtherGoal', {
      target: {x: 800, y: 0},
      theta: Vector.direction("up"),
      lineSize: 250,
      lineSizeSingleSide: true,
      lineDist: 120,
      lineDistMax: 120,
      decay: TensorMath.new.mult(-1).sum(1).finish,
      multiplier: 4000,
    }))
    this.addIntetion(new LineIntention('avoidOtherGoalInside', {
      target: {x: 800, y: 0},
      theta: Vector.direction("left"),
      lineSize: 100,
      lineSizeSingleSide: true,
      lineDist: 250,
      lineDistMax: 250,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: 4000,
    }))


    // Avoid other goal
    this.addIntetion(new LineIntention('avoidOwnGoal', {
      target: {x: -800, y: 0},
      theta: Vector.direction("up"),
      lineSize: 250,
      lineSizeSingleSide: true,
      lineDist: 120,
      lineDistMax: 120,
      decay: TensorMath.new.mult(-1).sum(1).finish,
      multiplier: 4000,
    }))
    this.addIntetion(new LineIntention('avoidOwnGoalInside', {
      target: {x: -800, y: 0},
      theta: Vector.direction("left"),
      lineSize: 100,
      lineSizeSingleSide: true,
      lineDist: 250,
      lineDistMax: 250,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: 4000,
    }))
    // this.orientation = 0
  }

  addIntetion(intention) {
    this.intentionGroup.addIntetion(intention)
    return intention
  }

  getIntentionsInfo() {
    return this.intentionGroup.intentions.map(x => x.getIntentionInfo())
  }

  setup() {}
  loop() {}

  computeRobotModelForIntention({vx, vy, vtheta}) {
    // Create Vector From Received Speed
    let targetSpeedVector = {x: vx, y: vy}
    // Escalar
    let targetSpeed = Vector.size(targetSpeedVector)
    //console.log(targetSpeedVector, targetSpeed)
    // Limit to robot limit
    if (targetSpeed > this.MAX_ROBOT_SPEED) {
      targetSpeed = this.MAX_ROBOT_SPEED
      targetSpeedVector = Vector.mult(Vector.norm(targetSpeedVector), this.MAX_ROBOT_SPEED)
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

    let speedWeight = this.speedImportance(targetSpeed)
    let vthetaWeight = 1 - speedWeight
    // console.log(vthetaWeight)

    let angular = (robotAngleToSpeed * 4 * speedWeight) + (vtheta * vthetaWeight)
    //console.log(linear, angular)
    return {linear, angular}
  }

  async update() {
    if(this.match.state.state.status == 'stopped'){
      await this.send(0,0,0)
      return
    }
    // if(this.frame){
    //   let frame = this.frame
    //   // Update ball position
    //   // console.log(frame)
    //   if(frame.balls[0]){
    //     this.lastBall = this.ball

    //     let dt = this.frame.t_capture - this.lastBallTimestamp
    //     this.lastBallTimestamp = this.frame.t_capture

    //     this.ball = frame.balls[0]

    //     if (dt && dt < 0.04 && this.lastBall) {

    //       this._ballSpeedsRaw.unshift({
    //         x: (this.ball.x - this.lastBall.x) / dt,
    //         y: (this.ball.y - this.lastBall.y) / dt,
    //       })

    //       this._ballSpeedsRaw = this._ballSpeedsRaw.slice(0, 10)

    //       let avgSpeed = this._ballSpeedsRaw.reduce((last, speed) => {
    //         return {x: last.x + speed.x, y: last.y + speed.y}
    //       }, {x: 0, y: 0})

    //       avgSpeed.x = avgSpeed.x / this._ballSpeedsRaw.length
    //       avgSpeed.y = avgSpeed.y / this._ballSpeedsRaw.length

    //       this.ballSpeed = avgSpeed

    //       // console.log(dt + '\t' + avgSpeed.x.toFixed(0) + '\t' + avgSpeed.y.toFixed(0))
    //     }
    //     // Compute ball average speed
    //     // let sum = this.lastBalls.reduce((prev, ball) => {prev})
    //   }
    // } else{
    //   console.error("Frame not present in IntentionPlayer")
    // }
    await this.loop()

    // Prepare input for intentions
    let input = {
      x: this.position.x,
      y: this.position.y,
      theta: this.orientation,
    }

    // Get intention output
    let output = this.intentionGroup.compute(input)

    // Convert to robot model
    let {linear, angular} = this.computeRobotModelForIntention(output)

    // Apply to robot
    this.send(1, linear, angular)
  }
}