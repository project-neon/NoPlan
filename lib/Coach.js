module.exports = class Coach {

  constructor(dependencies) {
      this.match = dependencies.match
      this.robotsProperties = dependencies.robots

      this currentOrder = {}

      this.init()
  }
}
