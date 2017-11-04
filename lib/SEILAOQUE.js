const Vector = require('./Vector')
const Comm = require('./Comm')
const EventEmitter = require('events')

const sleep = ms => new Promise((res, rej) => setTimeout(res, ms))


class Simulator {

  constructor() {
    this.objects = []
  }

  update(dt) {
    // Compute dt if not assigned
    if (!dt) {
      let now = Date.now()
      dt = (now - this.lastTime) / 1000
      this.lastTime = now
    }

    if (dt > 0.05) {
      console.error('Dt weird:', dt)
      return
    }

    // Update all objects
    this.objects.forEach(object => object.update(dt))
  }

  addObject(object) {
    this.objects.push(object)
  }
}

class SimulatedRobot {
  constructor(size) {
    this.size = size
    this.maxLinearSpeed = 900
    this.maxAngularSpeed = 1200

    this.linear = 0
    this.angular = 0

    this.position = [0, 0]
    this.theta = 0
  }

  setSpeed(linear, angular) {
    this.linear = linear
    this.angular = angular
  }

  update(dt) {
    
    let deltaPos = Vector.mult(Vector.fromTheta(this.theta), dt * this.linear)
    
    let deltaTheta = this.angular * dt
    
    this.theta = this.theta + deltaTheta
    this.position = Vector.sum(this.position, deltaPos)
  }
}

let match = {
  vision: new EventEmitter(),
  driver: {
    send: function () {
      
    }
  }
}

Comm(match, {PORT: 80})


async function start() {
  while(1) {

    // Aguarda conectar com socket

    let sim = new Simulator()
    let r1 = new SimulatedRobot([75, 75])
    let ball = {x: 0, y: 0}

    sim.addObject(r1)

    // Simulator configurations
    const iterations = 200
    const customDt = 0.01

    // Initial simulation state
    r1.setSpeed(700, Math.PI*2)

    for(var i=3;i>0;i--){
      let packet = buildPacket(ball, r1, i)
      match.vision.emit('detection',packet)
      await sleep(1000)
    }

    for (let i = 0; i < iterations; i++) {

      // Logica
      let dist = Vector.sub(r1.position, ball)
      // Logica

      let packet = buildPacket(ball, r1)
      match.vision.emit('detection',packet)

      sim.update(customDt)
      await sleep(customDt * 1000)
    }
  }
}

process.on('unhandledRejection', (e) => {
  console.error('Unhandled Rejection')
  console.error(e.toString())
  process.exit(1)
})

start()

function buildPacket(ball, robot, id = 0) {
  return {
    frame_number: 99151,
    t_capture: 5304.89499,
    t_sent: 1509638855.785392,
    camera_id: 1,
    balls: [
      {
        confidence: 0.7377133369445801,
        area: 118,
        x: ball.x,
        y: ball.y,
        z: 0,
        pixel_x: 323.2542419433594,
        pixel_y: 387.22882080078125
      }
    ],
    robots_yellow: [],
    robots_blue: [
      {
        confidence: 0.9521661400794983,
        robot_id: id,
        x: robot.position[0],
        y: robot.position[1],
        orientation: robot.theta,
        pixel_x: 441.7045593261719,
        pixel_y: 142.09848022460938,
        height: 75
      }
    ]
  }
}

