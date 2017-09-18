const BasePlayer = require('./BasePlayer')

const CM_PER_SECCOND = 10
const DEGREES_PER_SECCOND = 1

module.exports = class Attacker extends BasePlayer {
  async update(robot, frame) {
    console.log('update', robot, frame)
    
    await this.send(10 * CM_PER_SECCOND, 10 * DEGREES_PER_SECCOND)
  }
}