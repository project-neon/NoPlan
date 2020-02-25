const AttackerMain = require('../players/experimental/AttackerMain')
const AttackerConduct = require('../players/experimental/AttackerConduct')
const AttackerHold = require('../players/experimental/AttackerHold')
const attackerTriangle = require('../players/experimental/AttackerTriangle')
const { SMALL_AREA, GP } = require('../entities/FieldConstraints')


module.exports = class AttackerRole {
    constructor(match) {
        this.match = match
        this.init()
    }

    async init() {
        this.plays = {
            main: new AttackerMain(0, this.match, null),
            conduct: new AttackerConduct(0, this.match, null),
            hold: new AttackerHold(0, this.match, null),
            triangle: new attackerTriangle(0, this.match, null)
        }
    }

    insideFieldConstraint (fieldConstraint, ball) {
        if (ball == null) return false
        if (ball.x > fieldConstraint.x0 && ball.x < fieldConstraint.x1
            && ball.y > fieldConstraint.y0 && ball.y < fieldConstraint.y1) return true
        return false
    }

    buildTriangle (robot) {
      return {
        x1: GP.x,
        y1: GP.y,
        x2: GP.x,
        y2: -GP.y,

        x3: robot.robots.self.position.x,
        y3: robot.robots.self.position.y
      }
    }

    isInsideTriangle (robot, ball) {
      const { x1, x2, x3, y1, y2, y3 } = this.buildTriangle(robot)
      const { x, y } = ball

      var denominator = ((y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3));
      var a = ((y2 - y3)*(x - x3) + (x3 - x2)*(y - y3)) / denominator;
      var b = ((y3 - y1)*(x - x3) + (x1 - x3)*(y - y3)) / denominator;
      var c = 1 - a - b;

      return 0 <= a && a <= 1 && 0 <= b && b <= 1 && 0 <= c && c <= 1;
    }

    decidePlay(robot, data) {
        let position = robot.robots.self.position
        let ball = data.cleanData.ball

        if (this.isInsideTriangle(robot, ball)) {
          robot.runningPlay = this.plays.triangle
          this.plays.triangle.setRobot(robot)
        } else if (this.insideFieldConstraint(SMALL_AREA, ball)) {
            robot.runningPlay = this.plays.hold
            this.plays.hold.setRobot(robot)
        } else {
            robot.runningPlay = this.plays.main
            this.plays.main.setRobot(robot)
        }
        console.log('|robot' + robot.radioId + '| decided play: ' + robot.runningPlay.constructor.name)
    }
}
