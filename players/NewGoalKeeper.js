// Math and vetor libs
const Vector = require('../lib/Vector')
const TensorMath = require('../lib/TensorMath')

// Intentions lib
const Intention = require('../Intention')
const IntentionPlayer = require('./IntentionPlayer')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

const MIN_BASE_LINEAR_SPEED = 600
const AvoidWall_Decay = TensorMath.new.finish
const AvoidWall_Speed = 980
const AvoidWall_Corridor_max = 430
const AvoidWall_Corridor = 430
const OffsetBallDistance = 130

module.exports = class NewGoalKeeper extends IntentionPlayer {
  setup(){
    
    let ball = () => {return this.ball}
    this.orientation = Math.PI / 2
    this.position = {x: 0, y: 40}

    // ============================================== Defend the goal
    this.$defend = new Intention('defend')
    this.addIntetion(this.$defend)
    // --------------------------- Follow the y of the ball fixed on a x
    this.$defend.addIntetion(new LineIntention("followBallToDefend", {
      target: () => {
            return {x: this.CENTER_OWN_GOAL + 180, y: this.ball.y } 
          },
      theta: Vector.direction("right"),
      multiplier: MIN_BASE_LINEAR_SPEED,
      decay: TensorMath.new.mult(-1).finish,
      lineSize: 1700,
      lineDist: 80
    }))
    // ---------------------------- Look to the ball
    this.$defend.addIntetion(new LookAtIntention('lookAtBall', 
    {
      target: () => {return {x: this.ball.x - 50, y: this.ball.y}},
      decay: TensorMath.new.finish,
      multiplier: 20
    }))
    // ---------------------------- Maintain in the line X of the goal
    this.$defend.addIntetion(new LineIntention('follow_goalline', {
      target: {x: this.CENTER_OWN_GOAL + 200 , y: 0},
      theta: Vector.direction("up"),
      lineSize: 1700,
      lineDist: 200,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: MIN_BASE_LINEAR_SPEED + 100,
    }))
    // ============================================ end Defend the goal
    
    // ============================================ Repel the Ball
    this.$prepareAttack = new Intention('attackAccelerated')
    this.addIntetion(this.$prepareAttack)

    this.$prepareAttack.addIntetion(new PointIntention('goBall', {
      target: ball,
      radius: OffsetBallDistance * 2,
      radiusMax: OffsetBallDistance * 2,
      decay: TensorMath.new.constant(1).finish,
      multiplier: MIN_BASE_LINEAR_SPEED + 100,
    }))
    // ============================================ end Repel the Ball

    // ============================================ Dont go to the sides
    this.$avoidWalls = new Intention()
    this.$avoidWalls.addIntetion(new LineIntention('topWall', {
      // target: ball,
      target: this.Field.TopRight,
      theta: Vector.direction("right"),
      lineSize: this.Field.width, // Largura do segmento de reta
      // lineSizeSingleSide: true,
      lineDist: AvoidWall_Corridor, // Tamanho da repelência
      lineDistMax: AvoidWall_Corridor_max, // Tamanho da repelência
      // lineDistSingleSide: true,
      
      decay: AvoidWall_Decay,
      multiplier: AvoidWall_Speed,
    }))

    this.$avoidWalls.addIntetion(new LineIntention('bottomWall', {
      // target: ball,
      target: this.Field.BottomLeft,
      theta: Vector.direction("left"),
      lineSize: this.Field.width, // Largura do segmento de reta
      // lineSizeSingleSide: true,

      lineDist: AvoidWall_Corridor, // Tamanho da repelência
      lineDistMax: AvoidWall_Corridor_max, // Tamanho da repelência
      // lineDistSingleSide: true,
      
      decay: AvoidWall_Decay,
      multiplier: AvoidWall_Speed,
    }))
    this.addIntetion(this.$avoidWalls)
    // ============================================ end Dont go to the sides
    this.ballSpeedInit = this.ballSpeed
  }

  loop(){
    let toBall = Vector.sub(this.ball, this.position)
    let toBallDist = Vector.size(toBall)

    let bola = this.ballSpeed
    let realBallSpeed = Vector.size(Vector.sub(bola,this.ballSpeedInit)).toFixed(1)
    
    let toBallAngle = Vector.toDegrees(Vector.angle(toBall))
    let toGoalAngle = Vector.toDegrees(Vector.angle({x: this.CENTER_ENEMY_GOAL, y: this.position.y}))

    let diffBetweenAngles =  toGoalAngle + toBallAngle

    if (this.ball.x < -380) {
      this.$defend.weight = 0
      this.$prepareAttack.weight = 1
      this.$avoidWalls.weight = 0
    }else {
      this.$defend.weight = 1
      this.$prepareAttack.weight = 0
      this.$avoidWalls.weight = 1
    }
  }
}