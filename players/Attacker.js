const BasePlayer = require('./BasePlayer')

module.exports = class Attacker extends BasePlayer {
  async update(robot, frame) {
    try{
      console.log("Robot", robot)
      //console.log('Frame: ',frame)
    } catch(e) {
      console.log(e)
    }
  }
}