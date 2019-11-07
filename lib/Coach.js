const _ = require('lodash')
const GoalKeeper = require('../players/experimental/GoalkeeperMain')
const GoalKeeperSides = require('../players/experimental/GoalkeeperSides')
const GoalKeeperPush = require('../players/experimental/GoalkeeperPush')
const FieldConstraints = require('../entities/FieldConstraints')
const Attacker = require('../players/experimental/Attacker')
const AttackerFoward = require('../players/experimental/AttackerFoward')
const AttackerSides = require('../players/experimental/AttackerSides')
const AttackerAvoidSides = require('../players/experimental/AttackerAvoidSides')
const MidfielderAttacker = require('../players/experimental/MidFieldAttacker')
const MidfielderDefender = require('../players/experimental/MidFieldDefender')
const RulesPlay = require('../players/experimental/RulePlays')
const Vector = require('../lib/Vector')

module.exports = class Coach {
  constructor (dependencies) {
    this.match = dependencies.match
    this.robotsProperties = this.match.robotsProperties
    this.currentOrder = {}
    this.init()
  }

  async init () {
    // Inicializa algoritmos e estruturas auxiliares para tomar decisões
    this.goalkeeperId = null
    this.attackerId = null
    this.midfieldId = null
    this.attackerRobot = null
    this.Rules = new RulesPlay(0, this.match, null)

    this.goalkeeper = {
      main: new GoalKeeper(0, this.match, null),
      push: new GoalKeeperPush(0, this.match, null),
      side: new GoalKeeperSides(0, this.match, null)
    }
    this.attacker = {
      main: new Attacker(0, this.match, null),
      foward: new AttackerFoward(0, this.match, null),
      sides: new AttackerSides(0, this.match, null),
      avoidSides: new AttackerAvoidSides(0, this.match, null)
    }
    this.midfielder = {
      inAttack: new MidfielderAttacker(0, this.match, null),
      inDefense: new MidfielderDefender(0, this.match, null),
      sides: new AttackerSides(0, this.match, null),
      avoidSides: new AttackerAvoidSides(0, this.match, null)
    }
  }

  insideFieldConstraint (fieldConstraint, ball) {
    if (ball == null) return false
    if (ball.x > fieldConstraint.x0 && ball.x < fieldConstraint.x1 &&
        ball.y > fieldConstraint.y0 && ball.y < fieldConstraint.y1) return true
    return false
  }

  async decide (data, robots) {
    /*
    Metodo principal de decisão do coach para os robos, atribui aos objetos de
    robots:
      - running_play: a Play vigente que sera executada pelo robot naquela iteração
      - robots: um dicionario contento 3 elementos relativos aos dados dos robos:
        * self: dados referentes ao proprio robo
        * teammate: lista de elementos referentes aos dados dos robos de mesmo time
        * foes: lista de elementos robos referentes aos dados dos robos adversarios

    @param data     Dados tratados pelo dataManager
    @param robots   ultima iteração de robots.
    */
    // options {visionId, radioId}
    // id

    let distFromBallCandidateGK = 100000

    if (!this.goalkeeperId) {
      _.values(robots).map(robot => {
        if (robot.robots.self.position) {
          const distToGoalCenter = Vector.distBetween({x: -700, y: 0}, robot.robots.self.position)
          if (distFromBallCandidateGK > distToGoalCenter) {
            this.goalkeeperId = robot.radioId
            distFromBallCandidateGK = distToGoalCenter
          }
        }
      })
    }

    let distToBallCandidateATK = 1000000
    const ball = this.match.dataManager.ball
    _.values(robots).map(robot => {
      if (robot.radioId !== this.goalkeeperId) {
        if (robot.robots.self.position) {
          if (!ball) {
            this.attackerId = robot.radioId
          } else {
            const distToBall = Vector.distBetween(ball, robot.robots.self.position)
            if (distToBallCandidateATK > distToBall) {
              this.attackerId = robot.radioId
              distToBallCandidateATK = distToBall
            }
          }
        }
      }
    })

    _.values(robots).map(robot => {
      if (robot.radioId === this.goalkeeperId) {
        if (!ball) {
          robot.runningPlay = this.goalkeeper.main
          this.goalkeeper.main.setRobot(robot)
        }
        if (this.insideFieldConstraint(FieldConstraints.SMALL_AREA_CENTER, ball)) {
          robot.runningPlay = this.goalkeeper.push
          this.goalkeeper.push.setRobot(robot)
        } else if (this.insideFieldConstraint(FieldConstraints.SMALL_AREA_LEFT, ball) ||
          this.insideFieldConstraint(FieldConstraints.SMALL_AREA_RIGHT, ball)) {
          robot.runningPlay = this.goalkeeper.side
          this.goalkeeper.side.setRobot(robot)
        } else {
          robot.runningPlay = this.goalkeeper.main
          this.goalkeeper.main.setRobot(robot)
        }
      } else if (robot.radioId === this.attackerId) {
        this.attackerRobot = robot
        let robotPos = robot.robots.self.position
        let ball = {x: this.match.dataManager.ball.x, y: this.match.dataManager.ball.y}
        let ballToCenterGoal = Vector.sub({x: 700, y: 0}, ball)
        let robotToBall = Vector.sub(ball, robotPos)
        let angle = Vector.toDegrees(Vector.angleBetween(ballToCenterGoal, robotToBall))
        if (Math.abs(ball.y) > 500 && Math.abs(robotPos.y) > 500) {
          if (robotPos.x < ball.x) {
            robot.runningPlay = this.attacker.sides
            this.attacker.sides.setRobot(robot)
          } else {
            robot.runningPlay = this.attacker.avoidSides
            this.attacker.avoidSides.setRobot(robot)
          }
        } else if (Math.abs(angle) < 25) {
          robot.runningPlay = this.attacker.foward
          this.attacker.foward.setRobot(robot)
        } else {
          robot.runningPlay = this.attacker.main
          this.attacker.main.setRobot(robot)
        }
      } else {
        // MEIO CAMPISTA
        let robotPos = robot.robots.self.position
        if (ball.x > 0 || robotPos == null) {
          robot.runningPlay = this.midfielder.inAttack
          this.midfielder.inAttack.setRobot(robot)
        } else {
          if (Math.abs(ball.y) > 500 && Math.abs(robotPos.y) > 500) {
            if (robotPos.x < ball.x) {
              robot.runningPlay = this.midfielder.sides
              this.midfielder.sides.setRobot(robot)
            } else {
              robot.runningPlay = this.midfielder.avoidSides
              this.midfielder.avoidSides.setRobot(robot)
            }
          } else {
            robot.runningPlay = this.midfielder.inDefense
            this.midfielder.inDefense.setRobot(robot)
          }
        }
      }
    })
  }
}
