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
    this.position = {x: -300, y: 40}

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

    // // ============================================== Avoid Robots
    // this.$avoidRobots = new Intention('avoidRobots')
    // this.addIntetion(this.$avoidRobots)

    // // for (let i = 0; i < 3; i ++) {
    // //   this.$avoidRobots.addIntetion(new PointIntention('avoidRobot#'+i, {
    // //     // target: ball,
    // //     target: (),
    // //     theta: Direction.RIGHT,
    // //     lineSize: Field.width, // Largura do segmento de reta
    // //     lineSizeSingleSide: true,

    // //     lineDist: 300, // Tamanho da repelência
    // //     lineDistMax: 300, // Tamanho da repelência
    // //     lineDistSingleSide: true,
        
    // //     decay: TensorMath.new.mult(-1).finish,
    // //     multiplier: 300,
    // //   }))
    // // }


    // // ============================================== Avoid Walls
    // this.$avoidWalls = new Intention('avoidWalls')
    // this.addIntetion(this.$avoidWalls)

    // this.$avoidWalls.addIntetion(new LineIntention('topWall', {
    //   // target: ball,
    //   target: Field.TopLeft,
    //   theta: Direction.RIGHT,
    //   lineSize: Field.width, // Largura do segmento de reta
    //   // lineSizeSingleSide: true,

    //   lineDist: AvoidWall_Corridor, // Tamanho da repelência
    //   lineDistMax: AvoidWall_Corridor, // Tamanho da repelência
    //   // lineDistSingleSide: true,
      
    //   decay: AvoidWall_Decay,
    //   multiplier: AvoidWall_Speed,
    // }))

    // this.$avoidWalls.addIntetion(new LineIntention('bottomWall', {
    //   // target: ball,
    //   target: Field.BottomRight,
    //   theta: Direction.LEFT,
    //   lineSize: Field.width, // Largura do segmento de reta
    //   // lineSizeSingleSide: true,

    //   lineDist: AvoidWall_Corridor, // Tamanho da repelência
    //   lineDistMax: AvoidWall_Corridor, // Tamanho da repelência
    //   // lineDistSingleSide: true,
      
    //   decay: AvoidWall_Decay,
    //   multltiplier: AvoidWall_Speed,
    // })) 

    // this.$attackAccelerated = new Intention('attackAccelerated')
    // this.addIntetion(this.$attackAccelerated)

    // this.$attackAccelerated.addIntetion(new PointIntention('goBall', {
    //   target: ball,
    //   radius: OffsetBallDistance * 4,
    //   radiusMax: OffsetBallDistance * 4,
    //   decay: TensorMath.new.constant(1).finish,
    //   multiplier: 500,
    // }))

    // // ============================================== Prepare Attack
    this.$prepareAttack = new Intention('prepareAttack')
    this.addIntetion(this.$prepareAttack)

    // this.$prepareAttack.addIntetion(new LineIntention('avoidBallOwnGoal', {
    //   // target: ball,
    //   target: ball,
    //   theta: Direction.DOWN,
    //   lineSize: 100, // Largura do segmento de reta
    //   lineDist: 180, // Tamanho da repelência
    //   lineDistMax: 180, // Tamanho da repelência
    //   lineDistSingleSide: true,
    //   decay: TensorMath.new.mult(-1).sum(1).finish,
    //   multiplier: 600,
    // }))

    // this.$prepareAttack.addIntetion(new LineIntention('openBallSpaceFromOtherSide', {
    //   // target: ball,
    //   target: ball,
    //   theta: Direction.RIGHT,
    //   lineSize: 350, // Largura do segmento de reta
    //   lineSizeSingleSide: true,

    //   lineDist: 250, // Tamanho da repelência
    //   lineDistMax: 250, // Tamanho da repelência
    //   // lineDistSingleSide: true,
    //   decay: TensorMath.new.mult(-1).sum(1).finish,
    //   multiplier: 500,
    // }))

    this.$prepareAttack.addIntetion(new PointIntention('followBall', {
      target: () => { return {x: this.ball.x - OffsetBallDistance, y: this.ball.y} },
      radius: 150,
      radiusMax: false,
      decay: TensorMath.new.constant(1).finish,
      multiplier: 500,
    }))

    this.$followXIntetion = new Intention('follow')
    this.$followXIntetion.addIntetion(new LineIntention('follow_y', {
      target: ball,
      theta: Direction.RIGHT,
      lineSize: 1700,
      lineDist: 200,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: 500,
    }))
    this.$followXIntetion.addIntetion(new LineIntention('follow_goalline', {
      target: {x: -100 , y: 0},
      theta: Direction.UP,
      lineSize: 1700,
      lineDist: 200,
      lineDistMax: 200,
      decay: TensorMath.new.constant(1).finish,
      multiplier: 500,
    }))
    this.addIntetion(this.$followXIntetion)

    // this.$rulesIntetion = new Intention('rules')
    // this.$rulesIntetion.addIntetion(new LineIntention('avoid_defensor_fault', {
    //   target: {x: -700 , y: 0},
    //   theta: Direction.UP,
    //   lineSize: 1700,
    //   lineDist: 200,
    //   lineDistMax: 200,
    //   decay: TensorMath.new.finish,
    //   multiplier: 800,
    // })) 
    // // ============================================== Attack with Acceleration
    // this.$attackAccelerated = new Intention('attackAccelerated')
    // this.addIntetion(this.$attackAccelerated)

    // this.$attackAccelerated.addIntetion(new PointIntention('goBall', {
    //   target: ball,
    //   radius: OffsetBallDistance + 50,
    //   radiusMax: OffsetBallDistance + 50,
    //   decay: this.currentAttackAcceleratedDecay.bind(this),
    //   multiplier: 700,
    // }))
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
    // console.log(this.position.x, Field.width/2)
    // if (this.position.x > 0) {
    //   this.intentionGroup.weight = 0
    // } else {
    //   this.intentionGroup.weight = 1
    // }
  }
}