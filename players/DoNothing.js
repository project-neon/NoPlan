const BasePlayer = require('./BasePlayer')
const Vector = require('../lib/Vector')

let MAX_SPEED=999

const sleep = ms => new Promise((res, rej) => setTimeout(res, ms))


module.exports = class DoNothing extends BasePlayer {
  async update() {
  
  }
}