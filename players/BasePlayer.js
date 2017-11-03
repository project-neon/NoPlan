module.exports = class BasePlayer {
  constructor (id, match, options) {
    this.id = id
    this.match = match
    this.options = options
    this.state = {id: id, class: this.name}
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

  get ball() {
    this.match.vision.on('detection',(detection) => {
    })
  }

  // Update robot state (linear and angular) targets
  async send(linear, angular) {
    try{
      // await this.match.driver.send(this.radioId, 1, linear, angular)
    } catch(e){
      console.log("Fail")
    }
  }

  async change (state) {

  }
  async connected () {}
  async disconnected () {}
}