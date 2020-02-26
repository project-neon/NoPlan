const _ = require('lodash')

const PointTestPlay = require('../players/tests/PointIntentionPlayer')
const LineTestPlay = require('../players/tests/LineIntentionPlayer')
const LookAtTestPlay = require('../players/tests/LookAtIntentionPlayer')



module.exports = class Coach {
  constructor(dependencies) {
      this.match = dependencies.match
      this.robotsProperties = this.match.robotsProperties

      this.currentOrder = {}

      this.init()
  }


  insideFieldConstraint (fieldConstraint, ball) {
    if (ball == null) return false
    if (ball.x > fieldConstraint.x0 && ball.x < fieldConstraint.x1
      && ball.y > fieldConstraint.y0 && ball.y < fieldConstraint.y1) return true
    return false
  }

  async init() {
    /*
    Inicializa algoritmos e estruturas auxiliares para tomar decisões
    */

    this.point = new PointTestPlay(0, this.match, null)
    this.line = new LineTestPlay(0, this.match, null)
    this.lookat = new LookAtTestPlay(0, this.match, null)
  }

  async decide(data, robots) {
    // let actualTest = this.point
    // let actualTest = this.line
    let actualTest = this.lookat

    let it = 0

    _.values(robots).map(robot => {
      if (it == 0) {
        robot.runningPlay = actualTest
        actualTest.setRobot(robot)
      }
      it += 1
    })
  }
}
