const GoalKeeperMain = require('../players/experimental/GoalkeeperMain2')
const FieldConstraints = require('../entities/FieldConstraints')


module.exports = class GoalKeeperRole {
    constructor(match) {
        this.match = match
        this.init()
    }

    async init() {
        this.plays = {
            main: new GoalKeeperMain(0, this.match, null),
        }
    }

    insideFieldConstraint (fieldConstraint, ball) {
        if (ball == null) return false
        if (ball.x > fieldConstraint.x0 && ball.x < fieldConstraint.x1
            && ball.y > fieldConstraint.y0 && ball.y < fieldConstraint.y1) return true
        return false
    }

    decidePlay(robot, data) {

        robot.runningPlay = this.plays.main
        this.plays.main.setRobot(robot)

        console.log('|robot' + robot.radioId + '| decided play: ' + robot.runningPlay.constructor.name)
    }
}