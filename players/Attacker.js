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
const AvoidWall_Speed = 100
const AvoidWall_Corridor = 200

const OffsetBallDistance = 75
const MinAttackSpeed = 150

module.exports = class Attacker extends IntentionPlayer {
  setup(){
    
    let ball = () => this.ball

    this.orientation = Math.PI / 2
    this.position = {x: 0, y: 40}

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
      target: ball,
      theta: Direction.DOWN,
      lineSize: 50, // Largura do segmento de reta
      lineDist: 180, // Tamanho da repelência
      lineDistMax: 180, // Tamanho da repelência
      lineDistSingleSide: true,
      decay: TensorMath.new.mult(-1).sum(1).finish,
      multiplier: 700,
    }))

    this.$prepareAttack.addIntetion(new LineIntention('openBallSpaceFromOtherSide', {
      target: ball,
      theta: Direction.RIGHT,
      lineSize: 350, // Largura do segmento de reta
      lineSizeSingleSide: true,
      lineDist: 250, // Tamanho da repelência
      lineDistMax: 250, // Tamanho da repelência
      decay: TensorMath.new.mult(-1).sum(1).finish,
      multiplier: 600,
    }))

    this.$prepareAttack.addIntetion(new PointIntention('followBall', {
      target: () => {
        return {x: this.ball.x - OffsetBallDistance, y: this.ball.y} 
      },
      radius: 150,
      radiusMax: false,
      decay: TensorMath.new.finish,
      multiplier: 700,
    }))

    // ============================================== Rules
    this.$rules = new LineIntention('avoid_defence_fault', {
      target: {x: -850 , y: 0},
      theta: Direction.UP,
      lineSize: 100000, //360,
      lineDist: 650,
      lineDistMax: 650,
      decay: TensorMath.new.mult(-1).sum(1).finish,
      multiplier: 2200,
    })
    this.addIntetion(this.$rules)

    // ============================================== Attack with Acceleration
    // this.$attackAccelerated = new Intention('attackAccelerated')
    // this.addIntetion(this.$attackAccelerated)

    this.$attackAccelerated = this.addIntetion(new PointIntention('goBall', {
      target: () => {

        // let prop = Vector.size(Vector.sub(this.ball, this.position))
        // if (prop < 100) {
        //   return {x: 800, y: 0}
        // }
        // console.log('dist', prop.toFixed(0))
        return {x: this.ball.x, y: this.ball.y} 
      },
      radius: OffsetBallDistance + 150,
      radiusMax: OffsetBallDistance + 150,
      decay: TensorMath.new.constant(1).finish,
      multiplier: this.currentAttackMultiplier.bind(this),
    }))

    this.$goGoal = this.addIntetion(new PointIntention('goGoal', {
      target: {x: 800, y: 30},
      // () => {
      //   // let prop = Vector.size(Vector.sub(this.ball, this.position))
      //   // if (prop < 100) {
      //     return {x: 800, y: 0}
      //   // }
      //   // console.log('dist', prop.toFixed(0))
      //   // return {x: this.ball.x, y: this.ball.y} 
      // },
      radius: 150,
      radiusMax: false,
      decay: TensorMath.new.finish,
      multiplier: 800,
    }))

    // this.$goGoal = this.addIntetion(new LineIntention('goGoal', {
    //   target: {x: 900, y: 0},
    //   theta: Direction.LEFT,

    //   lineSize: 100000, //360,
    //   lineDist: 650,
    //   lineDistMax: 650,
    //   decay: TensorMath.new.mult(-1).sum(1).finish,
    //   multiplier: 800,
    //   // () => {
    //   //   // let prop = Vector.size(Vector.sub(this.ball, this.position))
    //   //   // if (prop < 100) {
    //   //     return {x: 800, y: 0}
    //   //   // }
    //   //   // console.log('dist', prop.toFixed(0))
    //   //   // return {x: this.ball.x, y: this.ball.y} 
    //   // },
    //   // radius: 150,
    //   // radiusMax: false,
    //   // decay: TensorMath.new.finish,
    //   // multiplier: 600,
    // }))

  }

  currentAttackMultiplier(dist) {
    // this.$prepareAttack.weight = 0

    let speed = Math.max(260, Vector.size(this.ballSpeed)*2.0 + 260)
    // console.log('speed', speed.toFixed(0))
    return speed
  }


  loop(){
    let toBall = Vector.sub({x: this.ball.x + 50, y: this.ball.y}, this.position)
    let toBallDist = Vector.size(toBall)
    let toBallAngle = Vector.toDegrees(Vector.angle(toBall))
    let withinAttackArea = (toBall.x > 0) && Math.abs(toBallAngle) < (35) // 35
    
    if (!withinAttackArea) {
      this.$prepareAttack.weight = 1
      this.$attackAccelerated.weight = 0
      this.$goGoal.weight = 0
      // console.log('outside', (toBallAngle).toFixed(0))
    } else {
      this.$prepareAttack.weight = 0.5
      this.$attackAccelerated.weight = 1

      if (toBallDist > 300 || (toBallDist < 120 && this.ballSpeed.x > 300)) {
        console.log('inside GO GOAL!', toBallDist.toFixed(0) + '\t'+this.ballSpeed.x.toFixed(0))
        this.$goGoal.weight = 1
      } else {
        console.log('inside         ', toBallDist.toFixed(0) + '\t'+this.ballSpeed.x.toFixed(0))
        this.$goGoal.weight = 0
      }
// >>>>>>> Stashed changes
    }

    // this.$prepareAttack.weight = 0

    // let speed = Math.max(160, Vector.size(this.ballSpeed) + 70) * 2
    // console.log('speed', speed.toFixed(0))
    // return speed

// <<<<<<< Updated upstream
//     this.$avoidWalls.weight = 1
//     console.log(this.getIntentionsInfo())
// =======

    this.$avoidWalls.weight = 0.3
// >>>>>>> Stashed changes
    // this.$prepareAttack.weight = 1
    // this.$attackAccelerated.weight = 1
    // console.log(this.intentionGroup.output)
  }
}