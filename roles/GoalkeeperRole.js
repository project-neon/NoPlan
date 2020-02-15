const GoalKeeperMain = require('../players/experimental/GoalkeeperMain2')
const GoalKeeperSides = require('../players/experimental/GoalkeeperSides2')
const GoalKeeperPush = require('../players/experimental/GoalKeeperPush2')
const GoalKeeperKeep = require('../players/experimental/GoalKeeperKeep')
const FieldConstraints = require('../entities/FieldConstraints')


module.exports = class GoalKeeperRole {
    constructor(match) {
        this.match = match
        this.init()
    }

    async init() {
        this.plays = {
            main: new GoalKeeperMain(0, this.match, null),
            sides: new GoalKeeperSides(0, this.match, null),
            push: new GoalKeeperPush(0, this.match, null),
            keep: new GoalKeeperKeep(0, this.match, null)
        }
    }

    insideFieldConstraint (fieldConstraint, ball) {
        if (ball == null) return false
        if (ball.x > fieldConstraint.x0 && ball.x < fieldConstraint.x1
            && ball.y > fieldConstraint.y0 && ball.y < fieldConstraint.y1) return true
        return false
    }

    decidePlay(robot, data) {
        
        const ball = data.cleanData.ball
        if(
            this.insideFieldConstraint(FieldConstraints.GOAL_INNER_AREA, ball)
            ){
            robot.runningPlay = this.plays.main
            this.plays.main.setRobot(robot)
        } else if (
            this.insideFieldConstraint(FieldConstraints.LEFT, ball) 
            || this.insideFieldConstraint(FieldConstraints.RIGHT, ball)
            ) {
            robot.runningPlay = this.plays.sides
            this.plays.sides.setRobot(robot)
        }else{
            robot.runningPlay = this.plays.main
            this.plays.main.setRobot(robot)
        }

        console.log('|robot' + robot.radioId + '| decided play: ' + robot.runningPlay.constructor.name)
    }
}