const _ = require('lodash')

const FieldConstraints = require('../entities/FieldConstraints')
const TestPlay = require('../players/tests/PointIntentionPlayer')

const GoalKeeper = require('../players/experimental/GoalkeeperMain')
const GoalKeeperSides = require('../players/experimental/GoalkeeperSides')
const GoalKeeperPush = require('../players/experimental/GoalkeeperPush')

const Vector = require('../lib/Vector')

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
   this.dumbRobots = [
     new TestPlay(0, this.match, null),
     new TestPlay(0, this.match, null),
     new TestPlay(0, this.match, null),
     new TestPlay(0, this.match, null),
     new TestPlay(0, this.match, null),
     new TestPlay(0, this.match, null)
   ]

    this.goalkeeper = {
      main: new GoalKeeper(0, this.match, null),
      push: new GoalKeeperPush(0, this.match, null),
      side: new GoalKeeperSides(0, this.match, null)
    }
  }

  async decide(data, robots) {
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
    
    let it = 0
    _.values(robots).map(robot => {
      let ball = null
      if (data)
        ball = data.cleanData.ball || null
      
      if (it == 0) {
        if (!ball) {
          robot.runningPlay = this.goalkeeper.main
          this.goalkeeper.main.setRobot(robot)
        }
        if (this.insideFieldConstraint(FieldConstraints.SMALL_AREA_CENTER, ball)) {
          robot.runningPlay = this.goalkeeper.push
          this.goalkeeper.push.setRobot(robot)

        } else if (this.insideFieldConstraint(FieldConstraints.SMALL_AREA_LEFT, ball)
          || this.insideFieldConstraint(FieldConstraints.SMALL_AREA_RIGHT, ball)) {
          robot.runningPlay = this.goalkeeper.side
          this.goalkeeper.side.setRobot(robot)

        } else {
          robot.runningPlay = this.goalkeeper.main
          this.goalkeeper.main.setRobot(robot)
        }
      } else {
        robot.runningPlay = this.dumbRobots[it]
        this.dumbRobots[it].setRobot(robot)
      }
      it += 1
    })
  }
}
