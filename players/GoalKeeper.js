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

const AvoidWall_Decay = TensorMath.new.finish
const AvoidWall_Speed = 980
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
      lineDist: 80,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: 900,
    }))

    this.$prepareAttack = new Intention('prepareAttack')
    this.addIntetion(this.$prepareAttack)

    this.$keepCenterGoal = new PointIntention('center_goal', {
      target: {x: this.CENTER_OWN_GOAL + 180, y: 0},
      radius: 150,
      radiusMax: false,
      decay: TensorMath.new.constant(1).finish,
      multiplier: 900,
    })

    this.$prepareAttack.addIntetion(this.$keepCenterGoal)

    this.$followXIntetion.addIntetion(new LineIntention('follow_goalline', {
      target: {x: this.CENTER_OWN_GOAL + 180 , y: 0},
      theta: Direction.UP,
      lineSize: 1700,
      lineDist: 200,
      //lineDistMax: 200,
      // lineDist: 80,
      // lineDistMax: 200,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: 900,
    }))
    this.addIntetion(this.$followXIntetion)
    // ============================================== Avoid Walls

    // this.$avoidWalls = new Intention('avoid_walls')
    // this.$avoidWalls.addIntetion(new LineIntention('topWall', {
    //   // target: ball,
    //   target: Field.TopRight,
    //   theta: Direction.RIGHT,
    //   lineSize: Field.width, // Largura do segmento de reta
    //   // lineSizeSingleSide: true,

    //   lineDist: AvoidWall_Corridor, // Tamanho da repelência
    //   lineDistMax: AvoidWall_Corridor_max, // Tamanho da repelência
    //   // lineDistSingleSide: true,
      
    //   decay: AvoidWall_Decay,
    //   multiplier: AvoidWall_Speed,
    // }))

    // this.$avoidWalls.addIntetion(new LineIntention('bottomWall', {
    //   // target: ball,
    //   target: Field.BottomLeft,
    //   theta: Direction.LEFT,
    //   lineSize: Field.width, // Largura do segmento de reta
    //   // lineSizeSingleSide: true,

    //   lineDist: AvoidWall_Corridor, // Tamanho da repelência
    //   lineDistMax: AvoidWall_Corridor_max, // Tamanho da repelência
    //   // lineDistSingleSide: true,
      
    //   decay: AvoidWall_Decay,
    //   multiplier: AvoidWall_Speed,
    // }))
    // this.addIntetion(this.$avoidWalls)

    // ============================================== comportamento de libero
    this.$attackAccelerated = new Intention('attackAccelerated')
    this.addIntetion(this.$attackAccelerated)

    this.$attackAccelerated.addIntetion(new PointIntention('goBall', {
      target: ball,
      radius: OffsetBallDistance * 2,
      radiusMax: OffsetBallDistance * 2,
      decay: TensorMath.new.constant(1).finish,
      multiplier: 1200,
    }))

  }

  loop(){
    if (this.ball.x > Field.width/3) {
      this.$followXIntetion.weight = 0
      this.$keepCenterGoal.weight = 1
    } else {
      this.$followXIntetion.weight = 1
      this.$keepCenterGoal.weight = 0
    }
  }
}