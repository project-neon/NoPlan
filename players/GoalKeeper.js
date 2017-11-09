const IntentionPlayer = require('./IntentionPlayer')
const TensorMath = require('../lib/TensorMath')
const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

// const FORWARD_SPEED = 500 // ~4.3s
const FORWARD_SPEED = 500 // ~4.3s

const ANGULAR_MULTIPLIER = 10

const AvoidWall_Decay = TensorMath.new.mult(-1).sum(1).finish

const Direction = {
  UP: Math.PI / 2,
  DOWN: - Math.PI / 2,
  RIGHT: 0,
  LEFT: Math.PI,
}
const AvoidWall_Speed = 990
const AvoidWall_Corridor = 620

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
    
    this.$goalkeeperIntetion = new Intention('goalkeeper')
    
    this.$goalkeeperIntetion.addIntetion(new LineIntention('follow_x', {
      target: ball,
      theta: Direction.RIGHT,
      lineSize: 1700,
      lineDist: 80,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: 990,
    }))

    this.$goalkeeperIntetion.addIntetion(new LineIntention('follow_goalline', {
      target: {x: 750 , y: 0},
      theta: Direction.UP,
      lineSize: 1700,
      lineDist: 80,
      lineDistMax: 200,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: 990,
    }))


    this.$goalkeeperIntetion.addIntetion(new LineIntention('topWall', {
      // target: ball,
      target: Field.TopLeft,
      theta: Direction.RIGHT,
      lineSize: Field.width, // Largura do segmento de reta
      // lineSizeSingleSide: true,

      lineDist: AvoidWall_Corridor, // Tamanho da repelência
      lineDistMax: AvoidWall_Corridor, // Tamanho da repelência
      // lineDistSingleSide: true,
      
      decay: AvoidWall_Decay,
      multiplier: AvoidWall_Speed,
    }))


    this.$goalkeeperIntetion.addIntetion(new LineIntention('bottomWall', {
      // target: ball,
      target: Field.TopRight,
      theta: Direction.LEFT,
      lineSize: Field.width, // Largura do segmento de reta
      // lineSizeSingleSide: true,

      lineDist: AvoidWall_Corridor, // Tamanho da repelência
      lineDistMax: AvoidWall_Corridor, // Tamanho da repelência
      // lineDistSingleSide: true,
      
      decay: AvoidWall_Decay,
      multiplier: AvoidWall_Speed,
    }))


    this.addIntetion(this.$goalkeeperIntetion)
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