let fail = 0
const MAX_ANGULAR = 999

module.exports = class BasePlayer {
  constructor (id, match, options) {
    this.id = id
    this.match = match
    this.options = options
    this.state = {id: id, class: this.name}
    this.balls = {x: null, y: null}
    this.speed = {linear : null, angular : null}
    this.position = {x : null, y : null, theta : null}
  }

  toObject () {
    return this.state
  }

  get visionId() {
    return this.options.visionId
  }

  get radioId() {
    return this.options.radioId
  }

  async ball() {
    // this.match.vision.on('detection', function(detection) {
    //   this.balls = {detection}
    // })
  }

  // Update robot state (linear and angular) targets
  async send(_state, _linear, _angular) {


    _angular = _angular > MAX_ANGULAR ? MAX_ANGULAR : _angular
    _angular = _angular < -MAX_ANGULAR ? -MAX_ANGULAR : _angular

    try{

      await this.match.driver.send(this.radioId, _state, linear, _angular)
    } catch(e){
      fail++
    }
  }

  // async gotoPoint(minAngle, ) {
  //   robot.itstarget = [state[0], state[1]];

  //   // Find Angle to ball
  //   var angleDx =  (state[0] - robot.state[0]);
  //   var angleDy =  (state[1] - robot.state[1]);

  //   var angle = -Math.atan2(angleDx, angleDy) * (180/Math.PI);
  //   var robotAngle = robot.state[2] * (180 / Math.PI) + 180;
    
  //   var relativeAngle = robotAngle - angle;
  //   var dist = Math.sqrt(Math.pow(angleDx, 2) + Math.pow(angleDy, 2));

  //   relativeAngle = Move.normalizeAngle(relativeAngle);
  //   var minDist = 50;

  //   if(dist < minDist){
  //     return true;
  //   }

  //   //  Approximation goes from 1 to 0
  //   var startApprox = 80;
  //   var approximation = (dist < startApprox ? (dist - minDist) / (startApprox - minDist) : 3.0); 

  //   var bestStartAngle = 35;
  //   var approximationAngle = (Math.min(Math.abs(relativeAngle), bestStartAngle) ) / bestStartAngle;

  //   // console.log(approximation+"");
  //   // console.log(approximationAngle);
  //   this.send(ySpeed * (1 - approximationAngle), relativeAngle * approximation);
  // }

  async move (state) {

  }
  async connected () {}
  async disconnected () {}
}