const _ = require('lodash')

const GoalKeeper = require('../roles/GoalkeeperRole')
const Attacker = require('../roles/AttackerRole')
// const MidFielder = require('../roles/MidfielderRole')

const Vector = require('../lib/Vector')



module.exports = class Coach {
  constructor(dependencies) {
      this.match = dependencies.match
      this.robotsProperties = this.match.robotsProperties

      this.currentOrder = {}

      this.actualGoalkeeper = null
      this.actualAttacker = null
      this.actualMidfielder = null

      this.init()
  }


  insideFieldConstraint (fieldConstraint, ball) {
    if (ball == null) return false
    if (ball.x > fieldConstraint.x0 && ball.x < fieldConstraint.x1
      && ball.y > fieldConstraint.y0 && ball.y < fieldConstraint.y1) return true
    return false
  }

  nearestRobotFrom(robots, object_) {
    let found_robots = robots.filter(function(robot) { return robot.robots.self.position})

    if (found_robots.length == 0) {
      return robots[0]
    }

    return found_robots.reduce(function(prev, current) {
      let prevDist = Vector.size(Vector.sub(prev.robots.self.position, object_))
      let currentDist = Vector.size(Vector.sub(current.robots.self.position, object_))
      return (prevDist < currentDist) ? prev : current
    })
  }

  async init() {
    /*
    Inicializa algoritmos e estruturas auxiliares para tomar decisões
    */
    this.goalKeeper = new GoalKeeper(this.match)
    this.attacker = new Attacker(this.match)
    // this.midfielder = new MidFielder(this.match)
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
    this.chosen = []
    this.actualGoalkeeper = null
    this.actualAttacker = null
    this.actualMidfielder = null


    let nearestRobotFromGoal = this.nearestRobotFrom(robots, {x: -750, y: 0})

    this.goalKeeper.decidePlay(nearestRobotFromGoal, data)
    this.chosen.push(nearestRobotFromGoal.radioId)
    this.actualGoalkeeper = nearestRobotFromGoal

    _.values(robots).map(robot => {
      if (robot != this.actualGoalkeeper) {
        this.attacker.decidePlay(robot, data)
      }
    })
  }
}
