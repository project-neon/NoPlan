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

  // Update robot state (linear and angular) targets
  async send(linear, angular) {
    // await this.match.driver.send(this.radioId, linear, angular)
  }

  async update (state) {}
  async connected () {}
  async disconnected () {}
}