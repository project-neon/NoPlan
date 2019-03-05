const _ = require('lodash')
const GoalKeeper = require('../players/experimental/GoalkeeperMain')
const GoalKeeperSides = require('../players/experimental/GoalkeeperSides')
const GoalKeeperPush = require('../players/experimental/GoalkeeperPush')
const FieldConstraints = require('../entities/FieldConstraints') 


module.exports = class Coach {
  constructor(dependencies) {
      this.match = dependencies.match
      this.robotsProperties = this.match.robotsProperties

      this.currentOrder = {}

      this.init()
  }

  async init() {
    /*
    Inicializa algoritmos e estruturas auxiliares para tomar decisões
    */

  }

  insideFieldConstraint (fieldConstraint, ball) {
    if (ball == null) return false
    if (ball.x > fieldConstraint.x0 && ball.x < fieldConstraint.x1
      && ball.y > fieldConstraint.y0 && ball.y < fieldConstraint.y1) return true
    return false
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


    _.values(robots).map(robot => {
      const ball = this.match.dataManager.ball
      robot.role = 'Goalkeeper'
      if (this.insideFieldConstraint(FieldConstraints.SMALL_AREA_CENTER, ball)) {
        // VERIFICA SE ESTA NA PEQUENA AREA
        robot.runningPlay = new GoalKeeperPush(0, this.match, robot)
      } else if (this.insideFieldConstraint(FieldConstraints.SMALL_AREA_LEFT, ball)
        || this.insideFieldConstraint(FieldConstraints.SMALL_AREA_RIGHT, ball)) {
        // VERIFICA SE ESTA NAS PEQUENAS AREAS LATERAIS
        robot.runningPlay = new GoalKeeperSides(0, this.match, robot)
      } else {
        robot.runningPlay = new GoalKeeper(0, this.match, robot)
        // COMPORTAMENTO PADRÃO
      }
    })
  }
}
