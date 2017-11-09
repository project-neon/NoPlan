const IntentionPlayer = require('./IntentionPlayer')
const TensorMath = require('../lib/TensorMath')
const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

// const FORWARD_SPEED = 500 // ~4.3s
const FORWARD_SPEED = 500 // ~4.3s

const ANGULAR_MULTIPLIER = 10

const Direction = {
  UP: Math.PI / 2,
  DOWN: - Math.PI / 2,
  RIGHT: 0,
  LEFT: Math.PI,
}

const AvoidWall_Decay = TensorMath.new.sum(1).finish
const AvoidWall_Speed = 700
const AvoidWall_Corridor_max = 420
const AvoidWall_Corridor = 420

const OffsetBallDistance = 130

const Field = {
  width: 1700,
  TopLeft: {x: -775, y: 675},
  TopRight: {x: 775, y: 675},
  BottomLeft: {x: -775, y: -675},
  BottomRight: {x: 775, y: -675}
}

module.exports = class GoalKeeper extends IntentionPlayer {
  setup(){
    let ball = () => {
      return {x: this.ball.x,
              y: this.ball.y}
    }
       
    // ============================================== Follow Ball in y
    this.$followXIntetion = new Intention('goalkeeper_following')
    this.$followXIntetion.addIntetion(new LineIntention('follow_y', {
      target: ball,
      theta: Direction.RIGHT,
      lineSize: 1700,
      lineDist: 200,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: 700,
    }))

    this.$followXIntetion.addIntetion(new LineIntention('follow_goalline', {
      target: {x: -740 , y: 0},
      theta: Direction.UP,
      lineSize: 1700,
      lineDist: 200,
      lineDistMax: 200,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: 800,
    }))
    this.addIntetion(this.$followXIntetion)
    // ============================================== Avoid Walls

    this.$avoidWalls = new Intention('avoid_walls')
    this.$avoidWalls.addIntetion(new LineIntention('topWall', {
      // target: ball,
      target: Field.TopRight,
      theta: Direction.RIGHT,
      lineSize: Field.width, // Largura do segmento de reta
      // lineSizeSingleSide: true,

      lineDist: AvoidWall_Corridor, // Tamanho da repelência
      lineDistMax: AvoidWall_Corridor_max, // Tamanho da repelência
      // lineDistSingleSide: true,
      
      decay: AvoidWall_Decay,
      multiplier: AvoidWall_Speed,
    }))

    this.$avoidWalls.addIntetion(new LineIntention('bottomWall', {
      // target: ball,
      target: Field.BottomLeft,
      theta: Direction.LEFT,
      lineSize: Field.width, // Largura do segmento de reta
      // lineSizeSingleSide: true,

      lineDist: AvoidWall_Corridor, // Tamanho da repelência
      lineDistMax: AvoidWall_Corridor_max, // Tamanho da repelência
      // lineDistSingleSide: true,
      
      decay: AvoidWall_Decay,
      multiplier: AvoidWall_Speed,
    }))
    this.addIntetion(this.$avoidWalls)

    // ============================================== comportamento de libero
    this.$attackAccelerated = new Intention('attackAccelerated')
    this.addIntetion(this.$attackAccelerated)

    this.$attackAccelerated.addIntetion(new PointIntention('goBall', {
      target: ball,
      radius: OffsetBallDistance * 1.5,
      radiusMax: OffsetBallDistance * 1.5,
      decay: TensorMath.new.abs(1).finish,
      multiplier: 780,
    }))

  }

  loop(){
    // if (this.ball.y < -300 || this.ball.y > 300) {
    //   console.log('not OK!', this.ball)
    //   this.$followXIntetion.weight = 0
    // } else {
    //   console.log('OK!', this.ball)
    //   this.$followXIntetion.weight = 1
    // }
  }
}