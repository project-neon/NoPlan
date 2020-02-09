const GoalKeeper = require('../players/experimental/GoalkeeperMain')
const GoalKeeperSides = require('../players/experimental/GoalkeeperSides')
const GoalKeeperPush = require('../players/experimental/GoalkeeperPush')
const FieldConstraints = require('../entities/FieldConstraints')


module.exports = class GoalKeeperRole {
    constructor(match) {
        this.match = match
        this.init()
    }

    async init() {
        this.plays = {
            main: new GoalKeeper(0, this.match, null),
            push: new GoalKeeperPush(0, this.match, null),
            side: new GoalKeeperSides(0, this.match, null)
        }
    }

    insideFieldConstraint (fieldConstraint, ball) {
        if (ball == null) return false
        if (ball.x > fieldConstraint.x0 && ball.x < fieldConstraint.x1
            && ball.y > fieldConstraint.y0 && ball.y < fieldConstraint.y1) return true
        return false
    }

    decidePlay(robot, data) {
        /*
        O Goleiro tem 4 tipos de comportamentos bem definidos:

        1: Se não houver bola em campo então goleiro fica no centro do gol (play main)
        2: Se a bola estiver dentro da pequena area, empurre a bola para longe (play push)
        3: Se a bola estiver nas laterais da pequena area, proteja a trave mais proxima (play sides)
        4: caso contrario, fique no centro do gol (play main)
        */
        let ball = null
        if (data)
            ball = data.cleanData.ball || null
        if (!ball) {
            robot.runningPlay = this.plays.main
            this.plays.main.setRobot(robot)
        }
        if (this.insideFieldConstraint(FieldConstraints.SMALL_AREA_CENTER, ball)) {
            robot.runningPlay = this.plays.push
            this.plays.push.setRobot(robot)
        } else if (
            this.insideFieldConstraint(FieldConstraints.SMALL_AREA_LEFT, ball)
            || 
            this.insideFieldConstraint(FieldConstraints.SMALL_AREA_RIGHT, ball)
        ) {
            robot.runningPlay = this.plays.side
            this.plays.side.setRobot(robot)
        } else {
            robot.runningPlay = this.plays.main
            this.plays.main.setRobot(robot)
        }

        robot.runningPlay = this.plays.main
        this.plays.main.setRobot(robot)

        console.log('|robot' + robot.radioId + '| decided play: ' + robot.runningPlay.constructor.name)
    }
}