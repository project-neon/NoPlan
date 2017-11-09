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
  BottomRight: {x: 775, y: -675}
}

const AvoidWall_Decay = TensorMath.new.mult(-1).sum(1).finish
const AvoidWall_Speed = 300
const AvoidWall_Corridor = 200

const OffsetBallDistance = 75
const MinAttackSpeed = 150

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

    // ============================================== Avoid Robots
    this.$avoidRobots = new Intention('avoidRobots')
    this.addIntetion(this.$avoidRobots)

    // for (let i = 0; i < 3; i ++) {
    //   this.$avoidRobots.addIntetion(new PointIntention('avoidRobot#'+i, {
    //     // target: ball,
    //     target: (),
    //     theta: Direction.RIGHT,
    //     lineSize: Field.width, // Largura do segmento de reta
    //     lineSizeSingleSide: true,

    //     lineDist: 300, // Tamanho da repelência
    //     lineDistMax: 300, // Tamanho da repelência
    //     lineDistSingleSide: true,
        
    //     decay: TensorMath.new.mult(-1).finish,
    //     multiplier: 300,
    //   }))
    // }


    // ============================================== Avoid Walls
    this.$avoidWalls = new Intention('avoidWalls')
    this.addIntetion(this.$avoidWalls)

    this.$avoidWalls.addIntetion(new LineIntention('topWall', {
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

    this.$avoidWalls.addIntetion(new LineIntention('bottomWall', {
      // target: ball,
      target: Field.BottomRight,
      theta: Direction.LEFT,
      lineSize: Field.width, // Largura do segmento de reta
      // lineSizeSingleSide: true,

      lineDist: AvoidWall_Corridor, // Tamanho da repelência
      lineDistMax: AvoidWall_Corridor, // Tamanho da repelência
      // lineDistSingleSide: true,
      
      decay: AvoidWall_Decay,
      multiplier: AvoidWall_Speed,
    }))

    // ============================================== Prepare Attack
    this.$prepareAttack = new Intention('prepareAttack')
    this.addIntetion(this.$prepareAttack)

    this.$prepareAttack.addIntetion(new LineIntention('avoidBallOwnGoal', {
      // target: ball,
      target: ball,
      theta: Direction.DOWN,
      lineSize: 100, // Largura do segmento de reta
      lineDist: 180, // Tamanho da repelência
      lineDistMax: 180, // Tamanho da repelência
      lineDistSingleSide: true,
      decay: TensorMath.new.mult(-1).sum(1).finish,
      multiplier: 600,
    }))

    this.$prepareAttack.addIntetion(new LineIntention('openBallSpaceFromOtherSide', {
      // target: ball,
      target: ball,
      theta: Direction.RIGHT,
      lineSize: 350, // Largura do segmento de reta
      lineSizeSingleSide: true,

      lineDist: 250, // Tamanho da repelência
      lineDistMax: 250, // Tamanho da repelência
      // lineDistSingleSide: true,
      
      decay: TensorMath.new.mult(-1).sum(1).finish,
      multiplier: 600,
    }))

    this.$prepareAttack.addIntetion(new PointIntention('followBall', {
      // target: ball,
      target: () => { return {x: this.ball.x - OffsetBallDistance, y: this.ball.y} },
      radius: 150,
      radiusMax: false,
      decay: TensorMath.new.finish,
      multiplier: 500,
    }))

    // ============================================== Attack with Acceleration
    this.$attackAccelerated = new Intention('attackAccelerated')
    this.addIntetion(this.$attackAccelerated)

    this.$attackAccelerated.addIntetion(new PointIntention('goBall', {
      target: ball,
      radius: OffsetBallDistance + 150,
      radiusMax: OffsetBallDistance + 150,
      decay: TensorMath.new.constant(1).finish,
      multiplier: this.currentAttackMultiplier.bind(this),
    }))

    this.$goGoal = this.addIntetion(new PointIntention('goGoal', {
      target: {x: 780, y: 0},
      radius: 200,
      radiusMax: false,
      decay: TensorMath.new.finish,
      multiplier: 300
    }))

  }

  currentAttackProsperity() {

  }

  currentAttackMultiplier(dist) {
    // return 0
    let withinAttackArea = (this.position.x < this.ball.x)
    
    let target = 0
    if (!withinAttackArea) {
      target = 0
    } else {
      target = Math.max(150, Vector.size(this.ballSpeed) + 100)
    }

    console.log('target: '+ target.toFixed(0), dist)
    return target
    // let toBall = Vector.sub(this.ball, this.position)
  }


  loop(){
    this.$avoidWalls.weight = 0
    this.$prepareAttack.weight = 1
    this.$attackAccelerated.weight = 1
    this.$goGoal = 0
    // console.log(this.intentionGroup.output)
  }
}