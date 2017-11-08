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

const Field = {
  width: 1700,
  TopLeft: {x: -775, y: 675},
  TopRight: {x: 775, y: 675},
  BottomLeft: {x: -775, y: -675},
  BottomRight: {x: 775, y: -675}
}

module.exports = class Attacker extends IntentionPlayer {
  setup(){
    
    let ball = () => this.ball

    this.orientation = Math.PI / 2
    this.position = {x: 300, y: 40}

    // this.$goGoalUp = new Intention('goGoalUp')
    // this.$goGoalUp.addIntetion(new LineIntention('goal', {
    //   // target: ball,
    //   target: {x: 700, y: 0},
    //   lineDist:200,
    //   lineDistMax:650,
    //   lineSize:false,
    //   theta:Math.PI/2,
    //   decay: TensorMath.new.mult(-1).finish,
    //   multiplier: FORWARD_SPEED,
    // }))

    this.addIntetion(new LineIntention('avoidBallOwnGoal', {
      // target: ball,
      target: ball,
      theta: Direction.DOWN,
      lineSize: 100, // Largura do segmento de reta
      lineDist: 120, // Tamanho da repelência
      lineDistMax: 100, // Tamanho da repelência
      lineDistSingleSide: true,
      decay: TensorMath.new.pow(3).finish,
      multiplier: 700,
    }))

    // this.addIntetion(new LineIntention('topWall', {
    //   // target: ball,
    //   target: Field.TopLeft,
    //   theta: Direction.RIGHT,
    //   lineSize: Field.width, // Largura do segmento de reta
    //   lineSizeSingleSide: true,

    //   lineDist: 300, // Tamanho da repelência
    //   lineDistMax: 300, // Tamanho da repelência
    //   lineDistSingleSide: true,
      
    //   decay: TensorMath.new.mult(-1).finish,
    //   multiplier: 300,
    // }))

    // this.addIntetion(new LineIntention('bottomWall', {
    //   // target: ball,
    //   target: Field.BottomRight,
    //   theta: Direction.LEFT,
    //   lineSize: Field.width, // Largura do segmento de reta
    //   lineSizeSingleSide: true,

    //   lineDist: 300, // Tamanho da repelência
    //   lineDistMax: 300, // Tamanho da repelência
    //   lineDistSingleSide: true,
      
    //   decay: TensorMath.new.mult(-1).finish,
    //   multiplier: 300,
    // }))

    this.addIntetion(new LineIntention('openBallSpaceFromOtherSide', {
      // target: ball,
      target: ball,
      theta: Direction.RIGHT,
      lineSize: 350, // Largura do segmento de reta
      lineSizeSingleSide: true,

      lineDist: 200, // Tamanho da repelência
      lineDistMax: 200, // Tamanho da repelência
      // lineDistSingleSide: true,
      
      decay: TensorMath.new.finish,
      multiplier: 700,
    }))

    this.addIntetion(new PointIntention('followBall', {
      // target: ball,
      target: () => { return {x: this.ball.x - 75, y: this.ball.y} },
      radius: 150,
      radiusMax: false,
      decay: TensorMath.new.pow(3).finish,
      multiplier: FORWARD_SPEED,
    }))


    // this.addIntetion(this.$goGoalUp)
  }

  loop(){
    // console.log(this.intentionGroup.output)
  }
}