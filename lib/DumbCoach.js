const _ = require('lodash')

const GoalKeeper = require('../roles/GoalkeeperRole')
const Attacker = require('../roles/AttackerRole')
const MidFielder = require('../roles/MidfielderRole')

const { SMALL_AREA, GP } = require('../entities/FieldConstraints')
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

  buildTriangle (robot) {
    return {
      x1: GP.x,
      y1: GP.y - 100,
      x2: GP.x,
      y2: -GP.y + 100,

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

  nearestInGoalZone(robots, ball, remove) {
    let found_robots = robots.filter(function(robot) {
        if (robot.radioId == remove) {
          return false
        }

        if(!robot.robots.self.position) {
          return false
        }

        return true
    })

    for (const robot in found_robots) {
      if(!this.isInsideTriangle(found_robots[robot], ball)) {
        found_robots.filter(function(r) {r.radioId == found_robots[robot].radioId})
      }
    }

    if (found_robots.length == 0) {
      let non_gk_robots = robots.filter(function(robot) { return robot.radioId != remove })
      return non_gk_robots[0]
    }

    return found_robots.reduce(function(prev, current) {
      let prevDist = Vector.size(Vector.sub(prev.robots.self.position, ball))
      let currentDist = Vector.size(Vector.sub(current.robots.self.position, ball))
      return (prevDist < currentDist) ? prev : current
    })
  }

  async init() {
    /*
    Inicializa algoritmos e estruturas auxiliares para tomar decisões
    */
    this.goalKeeper = new GoalKeeper(this.match)
    this.attacker = new Attacker(this.match)
    this.midfielder = new MidFielder(this.match)
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
    let chosen = []
    this.actualGoalkeeper = null
    this.actualAttacker = null
    this.actualMidfielder = null


    let goalKeeperCandidate = this.nearestRobotFrom(robots, {x: -750, y: 0})

    this.goalKeeper.decidePlay(goalKeeperCandidate, data)
    chosen.push(goalKeeperCandidate.radioId)
    this.actualGoalkeeper = goalKeeperCandidate


    let ball = data.cleanData.ball
    let attackerCandidate = this.nearestInGoalZone(robots, ball)

    this.attacker.decidePlay(attackerCandidate, data)
    chosen.push(attackerCandidate.radioId)
    this.actualAttacker = attackerCandidate


    let midfilderCandidates = robots.filter(
      function(x) {
        return !chosen.includes(x.radioId)
        }
      )
    if (midfilderCandidates) {
      let midfilderCandidate = midfilderCandidates[0]
      this.midfielder.decidePlay(midfilderCandidate, data)
      this.actualMidfielder = midfilderCandidate
    }
  }
}
