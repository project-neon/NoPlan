const BasePlayer = require('./BasePlayer')
const Vector = require('../lib/Vector')

let MAX_SPEED=999

const sleep = ms => new Promise((res, rej) => setTimeout(res, ms))


module.exports = class FollowBall extends BasePlayer {
  async update() {

    if(this.match.state.state.status == "stopped"){
      await this.send(0,0,0)
      return
    }

    this.draft = this.draft || console.draft()

    let frame = this.frame

    if(frame.balls[0]){
      this.ball.x = frame.balls[0].x.toFixed(2)
      this.ball.y = frame.balls[0].y.toFixed(2)
    }
    
    if (frame) {

      let ball = Vector.sub(this.ball, this.position)
      let robot = Vector.fromTheta(this.orientation)
      let angle = Vector.angleBetween(ball, robot)
      let targetSpeed = Vector.toDegrees(angle)
      let speedFront = -Math.max(0, 400 - Math.abs(angle * 100)) 
      await this.send(1, speedFront,angle * 5)

    }
  }
}