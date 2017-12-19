const IntentionPlayer = require('./IntentionPlayer')

const Vector = require('../lib/Vector')
const TensorMath = require('../lib/TensorMath')
const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

// const FORWARD_SPEED = 500 // ~4.3s
const FORWARD_SPEED = 900 // ~4.3s

const ANGULAR_MULTIPLIER = 10

const TARGET_PRIORITIES = [
  {x: -600, y:    0, name: 'Goleiro'}, // Goleiro
  {x:    0, y:  500, name: 'Atacante'}, // Atacante
  {x:    0, y: -500, name: 'Zagueiro'}, // Zagueiro
]

function MinIndex(arr) {
  let leastIndex = -1
  let leastVal = Infinity
  for (let k in arr) {
    if (leastVal > arr[k]){ 
      leastIndex = k
      leastVal = arr[k]
    }
  }

  return leastIndex
}

module.exports = class TestIntention2 extends IntentionPlayer {
  setup(){
    let ball = () => {
      return {
        x: this.ball.x,
        y: this.ball.y
      }
    }

    // ----------------------------- Go Center Up
    this.$goTarget = new Intention('goTarget')
    this.$goTarget.addIntetion(new PointIntention('center', {
      // target: ball,
      target: this.getTarget.bind(this),
      radius: 150,
      radiusMax: false,
      decay: TensorMath.new.pow(3).finish,
      multiplier: FORWARD_SPEED,
    }))

    this.$goTarget.addIntetion(new LookAtIntention('lookUp', {
      // target: ,
      theta: Math.PI / 2,
      decay: TensorMath.new.finish,
      multiplier: ANGULAR_MULTIPLIER,
    }))

    this.addIntetion(this.$goTarget)


    // ----------------------------- Go Goal up
    // this.$goToMiddle = new Intention('goToMiddle')
    // this.$goToMiddle.addIntetion(new PointIntention('center', {
    //   target: {x: -330, y: 0},
    //   radius: 150,
    //   radiusMax: false,
    //   decay: TensorMath.new.pow(3).finish,
    //   multiplier: FORWARD_SPEED,
    // }))

    // this.$goToMiddle.addIntetion(new LookAtIntention('lookUp', {
    //   // target: ,
    //   theta: Math.PI / 2,
    //   decay: TensorMath.new.finish,
    //   multiplier: ANGULAR_MULTIPLIER,
    // }))

    // this.addIntetion(this.$goToMiddle)

  }

  bestTargetId() {
    let targets = {}

    // Check this robot is active
    // if (!this.isActive()) {
    //   return 0
    // }

    let robots = Object.values(this.match.worker.workers)
    let posits = robots.map(robot => String(robot.position.x) == 'NaN' ? {x: 0, y: 0} : robot.position)
    let allocated = robots.map(r => {
      // console.log(r.isActive)
      return !r.active
    })
    
    for (let k in TARGET_PRIORITIES) {
      let target = TARGET_PRIORITIES[k]

      // Find closest robot
      let deltas = posits.map(posit => Vector.sub(target, posit))
      // deltas = deltas.map(delta => delta.x == NaN ? {x: 0, y: 0} : delta)
      // console.log('robs:', deltas)
      let modulo = deltas.map(delta => Math.round(Vector.size(delta)))
      let moduloUnusedRobot = modulo.map((mod, index) => {
        return allocated[index] ? Infinity : mod
      })

      // console.log('usdns', moduloUnusedRobot)

      // Find minimum !!INDEX!!
      let robotIndex = parseInt(MinIndex(moduloUnusedRobot))

      if (robotIndex < 0) continue

      let bestRobot = robots[robotIndex]
      targets[bestRobot.id] = k
      allocated[robotIndex] = true
    }

    // console.log(targets)

    // for (let id in robots) {
    //   let robot = robots[id]

    //   // Find closest point
    //   let deltas = TARGET_PRIORITIES.map(target => Vector.sub(target, robot.position))
    //   let modulo = deltas.map(delta => Math.round(Vector.size(delta)))

    //   // console.log('r', id, modulo)

    //   // Find minimum !!INDEX!!
    //   let minIndex = parseInt(MinIndex(modulo))

    //   targets[id] = minIndex
    //   // console.log('r:', id, robots[id].position)
    // }

    // Find required goto
    // for (let k in TARGET_PRIORITIES) {
    //   let vals = Object.values(targets)
    //   // console.log(vals, vals.includes(parseInt(k)))
    //   if (parseInt(k) > targets[this.id]){
    //     break
    //   }

    //   if (vals.includes(parseInt(k))) {
    //     // It's ok...
    //     // console.log('ok:', k)
    //   } else {
    //     // Go There
    //     // console.log('tg:', k)
    //     targets[this.id] = parseInt(k)
    //     break
    //   }
    // }

    let targetIndex = targets[this.id]
    // if (typeof targetIndex != 'number') return 0;

    console.log(this.id, 'targetIndex', targetIndex)
    // console.log(this.id, TARGET_PRIORITIES[targetIndex].name)

    return targetIndex
  }

  getTarget() {
    let targetIndex = this.bestTargetId()

    // Check if no target (its inactive)
    if (targetIndex === undefined) {
      return {x: 0, y: 0}
    }

    return TARGET_PRIORITIES[targetIndex]
  }

  loop(){
    if(this.frame){
      
      let frame = this.frame
      
      let side = this.match.state.state.team
      let robots = frame['robots_' + side]
      

      // if(robots.length < 3){
        // this.$goToMiddle.weight = 1
        // this.$goToMiddle.weight = 1
        this.$goTarget.weight = 1
      // }else{
      //   this.$goToMiddle.weight = 1
      //   this.$goTarget.weight = 0
      // }
    }
  }
}