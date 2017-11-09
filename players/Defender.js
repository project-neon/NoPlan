const Vector = require('../lib/Vector')
const TensorMath = require('../lib/TensorMath')
const Intention = require('../Intention')
const IntentionPlayer = require('./IntentionPlayer')
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
  BottomRight: {x: 775, y: -675},
}

const AvoidWall_Decay = TensorMath.new.mult(-1).sum(1).finish
const AvoidWall_Speed = 990
const AvoidWall_Corridor = 200

const OffsetBallDistance = 100
  
module.exports = class Defender extends IntentionPlayer {
  setup(){
    
    let ball = () => this.ball

    this.orientation = Math.PI / 2
    this.position = {x: 400, y: 40}

    // // ============================================== Prepare Attack
    this.$prepareAttack = new Intention('prepareAttack')
    this.addIntetion(this.$prepareAttack)

    this.$followBall = new PointIntention('followBall', {
      target: () => { return {x: this.ball.x - OffsetBallDistance, y: this.ball.y} },
      radius: 150,
      radiusMax: false,
      decay: TensorMath.new.constant(1).finish,
      multiplier: 500,
    })

    this.$prepareAttack.addIntetion(this.$followBall)

    this.$followXIntetion = new Intention('follow')
    this.$followXIntetion.addIntetion(new LineIntention('follow_y', {
      target: ball,
      theta: Direction.RIGHT,
      lineSize: 1700,
      lineDist: 200,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: 500,
    }))

    this.addIntetion(this.$followXIntetion)

    this.$backToDefend = new LineIntention('back_to_defend', {
      target: {x: -Field.width/4, y: 0},
      theta: Direction.UP,
      lineSize: 1700,
      decay: TensorMath.new.pow(3).mult(-1).finish,
      multiplier: 500
    })
    this.addIntetion(this.$backToDefend)


    this.$rules = new LineIntention('avoid_defence_fault', {
      target: {x: -700 , y: 0},
      theta: Direction.UP,
      lineSize: 10000, //360,
      lineDist: 180,
      lineDistMax: 200,
      decay: TensorMath.new.constant(1).finish,
      multiplier: 500,
    })
    this.addIntetion(this.$rules)

    this.$followGoalline = new LineIntention('follow_goalline', {
      target: {x: 0 , y: 0},
      theta: Direction.UP,
      lineSize: 1700,
      lineDist: 50,
      lineDistMax: 50,
      decay: TensorMath.new.constant(1).finish,
      multiplier: 500,
    })


    this.$followXIntetion.addIntetion(this.$followGoalline)
    this.addIntetion(this.$prepareAttack)

    this.$followBall.addIntetion(new PointIntention('goBall', {
      target: ball,
      radius: OffsetBallDistance + 50,
      radiusMax: OffsetBallDistance + 50,
      decay: this.currentAttackAcceleratedDecay.bind(this),
      multiplier: 700,
    }))
  }

  currentAttackAcceleratedDecay(dist) {
    // return 0
    let withinAttackArea = (this.position.x < this.ball.x)
      
    if (!withinAttackArea) {
      return 0
    }

    
    // let toBall = Vector.sub(this.ball, this.position)
  }

    loop(){
      console.log('ball x:', this.ball.x)
      if(this.$backToDefend.weight == 1 && (
        parseInt(this.position.x) > -Field.width/6 - 10 && parseInt(this.position.x) < -Field.width/6 + 10)) {
        this.$backToDefend.weight = 0
        this.$followBall.weight = 0
      } else if (this.$backToDefend.weight == 0 && this.position.x > -10) {
        this.$backToDefend.weight = 1
        //this.$followBall.weight = 0
      }
      if (this.ball.x < 0) {
        this.$followBall.weight = 1
      }
  }
}