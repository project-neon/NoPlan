const BasePlayer = require('./BasePlayer')
const Vector = require('../lib/Vector')

let ball = {x:null,y:null}
let MAX_SPEED=999
const sleep = ms => new Promise((res, rej) => setTimeout(res, ms))

let aSpeed = 0

module.exports = class labsAngular extends BasePlayer {


  async update(robot, frame) {
    // console.log(frame)
    if (this.visionId == 3) {
      let orientation = robot.orientation * 180 / Math.PI
      // let now = Date.now()
      let now = frame.t_capture
      let dt = (now - this.lastNow)
      let delta = ( orientation - this.lastRotation )
      this.lastRotation = orientation
      this.lastNow = now
      if (dt > 0.2) {
        console.log('too large:', dt)
        return
      }

      while(delta >  180) delta -= 360;
      while(delta < -180) delta += 360;

      let velocity = delta / dt

      this.deltas = this.deltas || []

      if (velocity !== undefined && velocity !== Infinity) this.deltas.push(velocity)
      // console.log(this.deltas)
      while(this.deltas.length > 30) this.deltas.shift();
      let avgDelta = this.deltas.reduce((a, b) => a + b, 0) / this.deltas.length
      
      let dr = (Date.now() - this.lastRun)

      if(aSpeed < MAX_SPEED) 
        aSpeed += 1
      this.lastRun = Date.now()
      console.log('speed: ',aSpeed,'delta:', Math.round(velocity*100) / 100, '\tavg:', Math.round(avgDelta * 100) / 100, '\t', orientation)
    }
      if(frame.balls){
        ball.x = frame.balls[0].x.toFixed(2)
        ball.y = frame.balls[0].y.toFixed(2)
      }

    try{

      if(this.match.state.state.status == "running"){
          await this.send(1,0,aSpeed)
      } else{
        await this.send(0,0,0)
        aSpeed=0
      }

    } catch(e) {
      console.log(e)
    }
  }
}