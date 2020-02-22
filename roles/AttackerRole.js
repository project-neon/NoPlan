const AttackerMain = require('../players/experimental/AttackerMain')
const AttackerConduct = require('../players/experimental/AttackerConduct')
const FieldConstraints = require('../entities/FieldConstraints')


module.exports = class AttackerRole {
    constructor(match) {
        this.match = match
        this.init()
    }

    async init() {
        this.plays = {
            main: new AttackerMain(0, this.match, null),
            conduct: new AttackerConduct(0, this.match, null)
        }
    }

    insideFieldConstraint (fieldConstraint, ball) {
        if (ball == null) return false
        if (ball.x > fieldConstraint.x0 && ball.x < fieldConstraint.x1
            && ball.y > fieldConstraint.y0 && ball.y < fieldConstraint.y1) return true
        return false
    }

    decidePlay(robot, data) {
        let position = robot.robots.self.position
        let ball = data.cleanData.ball
        
        if (
            position.x < ball.x && position.y > ball.y - 40 && position.y < ball.y + 40
            ) {
            robot.runningPlay = this.plays.main
            this.plays.main.setRobot(robot)
        }else {
            robot.runningPlay = this.plays.main
            this.plays.main.setRobot(robot)
        }
        console.log('|robot' + robot.radioId + '| decided play: ' + robot.runningPlay.constructor.name)
    }
}