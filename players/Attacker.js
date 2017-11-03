const BasePlayer = require('./BasePlayer')
const Vector = require('../lib/Vector')
let MAX_SPEED=999

const sleep = ms => new Promise((res, rej) => setTimeout(res, ms))


module.exports = class Attacker extends BasePlayer {

  async update(robot, frame) {

      if(frame.balls[0]){
        this.ball.x = frame.balls[0].x.toFixed(2)
        this.ball.y = frame.balls[0].y.toFixed(2)
      }
      if(robot){
        this.position.x = robot.x
        this.position.y = robot.y
        this.position.theta = robot.orientation
      }
      if (frame) {
        if (this.visionId == 3) {
          
            let angleDx =  (this.ball.x - this.position.x)
            let angleDy =  (this.ball.y - this.position.y)
            
            // Find Angle to ball
            let angle = -Math.atan2(angleDx, angleDy) * (180/Math.PI);
            this.speed.angular = angle
          
        }
      }
    try{
      if(this.match.state.state.status == "running"){
          await this.send(1,0,this.speed.angular)
      } else{
        await this.send(0,0,0)
      }

    } catch(e) {
      console.log(e)
    }
  }
}