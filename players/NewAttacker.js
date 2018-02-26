const Vector = require('../lib/Vector')
const TensorMath = require('../lib/TensorMath')
const Intention = require('../Intention')
const IntentionPlayer = require('./IntentionPlayer')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

const FORWARD_SPEED = 500 // ~4.3s

const ANGULAR_MULTIPLIER = 10

const GOAL_POSITION_X = 800

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

const OffsetBallDistance = 150
const MinAttackSpeed = 120

module.exports = class NewAttacker extends IntentionPlayer {
  setup(){
    
    let ball = () => {return this.ball}
    // console.log(this.ball)
    this.orientation = Math.PI / 2
    this.position = {x: 0, y: 40}

    // ============================================== Avoid Robots
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
    //   multiplier: AvoidWall_Speed,
    // }))

    // ============================================== Prepare Attack
    this.$prepareAttack = new Intention('prepareAttack')
    this.addIntetion(this.$prepareAttack)

    this.$prepareAttack.addIntetion(new LineIntention('angularAvoidOwnGoal1', 
      {
        target: ball,
        theta: Direction.RIGHT,
        lineSize: 400,
        lineSizeSingleSide: true,
        lineDist: 120,
        lineDistMax: 120,
        decay: TensorMath.new.sub(1).mult(-1).finish,
        multiplier: 500,
      }
    ))

    this.$prepareAttack.addIntetion(new PointIntention('followBall', {
      target: () => {
        let OffsetGoal = ((OffsetBallDistance*this.position.y)/(GOAL_POSITION_X-this.position.x))
        // console.log(OffsetGoal)
        return {x: this.ball.x - OffsetBallDistance, y: this.ball.y + OffsetGoal} 
      },
      radius: 450,
      decay: TensorMath.new.finish,
      multiplier: 500,
    }))
    
    this.$makeGoal = new Intention("makeGoal")
    this.addIntetion(this.$makeGoal)

    this.$makeGoal = this.addIntetion(new PointIntention('goGoal', {
      target: {x: GOAL_POSITION_X, y: 0},
      // () => {
      //   // let prop = Vector.size(Vector.sub(this.ball, this.position))
      //   // if (prop < 100) {
      //     return {x: 800, y: 0}
      //   // }
      //   // console.log('dist', prop.toFixed(0))
      //   // return {x: this.ball.x, y: this.ball.y} 
      // },
      radius: 100,
      decay: TensorMath.new.sub(1).mult(-1).finish,
      multiplier: 500,
    }))
    // this.$makeGoal.addIntetion(new PointIntention('followBallToGoal', {
    //   target: ball,
    //   radius: 300,
    //   decay: TensorMath.new.finish,
    //   multiplier: 500,
    // }))

    // ============================================== Rules
    // this.$rules = new LineIntention('avoid_defence_fault', {
    //   target: {x: -850 , y: 0},
    //   theta: Direction.UP,
    //   lineSize: 100000, //360,
    //   lineDist: 650,
    //   lineDistMax: 650,
    //   decay: TensorMath.new.mult(-1).sum(1).finish,
    //   multiplier: 2200,
    // })
    // this.addIntetion(this.$rules)

    // ============================================== Attack with Acceleration
    // this.$attackAccelerated = new Intention('attackAccelerated')
    // this.addIntetion(this.$attackAccelerated)

    // this.$attackAccelerated = this.addIntetion(new PointIntention('goBall', {
    //   target: () => {

    //     // let prop = Vector.size(Vector.sub(this.ball, this.position))
    //     // if (prop < 100) {
    //     //   return {x: 800, y: 0}
    //     // }
    //     // console.log('dist', prop.toFixed(0))
    //     return {x: this.ball.x, y: this.ball.y} 
    //   },
    //   radius: OffsetBallDistance + 150,
    //   radiusMax: OffsetBallDistance + 150,
    //   decay: TensorMath.new.constant(1).finish,
    //   multiplier: this.currentAttackMultiplier.bind(this),
    // }))


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
    this.ballSpeedInit = this.ballSpeed

  }

  loop(){
    
    let toBall = Vector.sub(this.ball, this.position)
    let toBallDist = Vector.size(toBall)
    
    let toBallAngle = Vector.toDegrees(Vector.angle(toBall))
    let toGoalAngle = Vector.toDegrees(Vector.angle({x: GOAL_POSITION_X, y: this.position.y}))

    let diffBetweenAngles =  toGoalAngle+toBallAngle

    // let inLaterals = Math.abs(this.position.y) > 645

    // console.log(diffBetweenAngles)
    // console.log(toBallAngle,toGoalAngle,diffBetweenAngles)

    let bola = this.ballSpeed
    let realBallSpeed = Vector.size(Vector.sub(bola,this.ballSpeedInit)).toFixed(1)

    let prepareAttackWeight = Math.abs(diffBetweenAngles)/30
    let makeGoalWeight = Math.pow(0.9, (Math.abs(diffBetweenAngles)/2))

    this.$makeGoal.weight = makeGoalWeight
    this.$prepareAttack.weight = prepareAttackWeight

    // if (Math.abs(diffBetweenAngles) < 8) {
    //     this.$makeGoal.weight = 1
    //     this.$prepareAttack.weight = 0
    // } else {
    //     this.$makeGoal.weight = 0
    //     this.$prepareAttack.weight = 1
    // }

    console.log(this.$makeGoal.weight, this.$prepareAttack.weight)

// // <<<<<<< Updated upstream
//        this.$goGoal.weight = 0.3
// //       // console.log('inside')
// // =======
// >>>>>>> Stashed changes
    // this.$prepareAttack.weight = 0

    // let speed = Math.max(160, Vector.size(this.ballSpeed) + 70) * 2
    // console.log('speed', speed.toFixed(0))
    // return speed

// <<<<<<< Updated upstream
//     this.$avoidWalls.weight = 1
//     console.log(this.getIntentionsInfo())
// =======

    // this.$avoidWalls.weight = 0.3
// >>>>>>> Stashed changes
    // this.$prepareAttack.weight = 1
    // this.$attackAccelerated.weight = 1
    // console.log(this.intentionGroup.output)
  }
}