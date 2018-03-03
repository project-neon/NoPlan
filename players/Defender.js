const IntentionPlayer = require('./IntentionPlayer')
const TensorMath = require('../lib/TensorMath')
const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')
const Vector = require('../lib/Vector')
// const FORWARD_SPEED = 500 // ~4.3s
const FORWARD_SPEED = 500 // ~4.3s

const ANGULAR_MULTIPLIER = 10

const Direction = {
  UP: Math.PI / 2,
  DOWN: - Math.PI / 2,
  RIGHT: 0,
  LEFT: Math.PI,
}

const AvoidWall_Decay = TensorMath.new.finish
const AvoidWall_Speed = 980
const AvoidWall_Corridor_max = 100
const AvoidWall_Corridor = 100
const OffsetBallDistance = 130

const Field = {
  width: 1700,
  TopLeft: {x: -775, y: 675},
  TopRight: {x: 775, y: 675},
  BottomLeft: {x: -775, y: -675},
  BottomRight: {x: 775, y: -675}
}

module.exports = class Defender extends IntentionPlayer {
  setup(){
    let ball = () => {
      return {x: this.ball.x,
              y: this.ball.y}
    }
    // ============================================== Follow Ball in Y while Being in an X
    this.$followYIntetion = new Intention('goalkeeper_following')
    this.addIntetion(this.$followYIntetion)
    
    this.$followYIntetion.addIntetion(new LineIntention('follow_Y', {
      target: () => { return {x:this.ball.x-100, y:this.ball.y}},
      theta: Direction.RIGHT,
      lineSize: 1700,
      lineDist: 80,
      decay: TensorMath.new.pow(2).mult(-1).finish,
      multiplier: 600,
    }))

    this.$followYIntetion.addIntetion(new LineIntention('follow_X', {
      target: {x: -250 , y: 0},
      theta: Direction.UP,
      lineSize: 1700,
      lineDist: 200,
      decay: TensorMath.new.pow(2).mult(-1).finish,
      multiplier: 600,
    }))


    this.$kickBall = new Intention('pushBall')
    this.addIntetion(this.$kickBall)

    this.$kickBall.addIntetion(new PointIntention('pushBall', {
      target: () => { return {x:this.ball.x , y:this.ball.y}},
      radius: 200,
      radiusMax: 200,
      decay: TensorMath.new.constant(1).finish,
      multiplier: 500
    }))

    this.$avoidWalls = new Intention('avoid_walls')
    this.addIntetion(this.$avoidWalls)
    

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
      lineDist: AvoidWall_Corridor, // Tamanho da repelência
      lineDistMax: AvoidWall_Corridor_max, // Tamanho da repelência
      decay: AvoidWall_Decay,
      multiplier: AvoidWall_Speed,
    }))
   

  
  }

  loop(){
    let toBall = Vector.sub({x: this.ball.x, y: this.ball.y}, this.position)
    let toBallDist = Vector.size(toBall)
    let toBallAngle = Vector.toDegrees(Vector.angle(toBall))

    if (Math.abs(toBallAngle) < 10) {
      console.log("Inside")
    }
   
  }
}