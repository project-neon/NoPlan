const _ = require('lodash')
module.exports = class GameManager {
  constructor (match) {
    this.match = match
    this.robotsProperties = this.match.robotsProperties
    this.dataManager = this.match.dataManager
    this.robots = null
    this.coaches = [null, null]
  }

  async startRobot (id, property, teamId) {
    this.robots[id] = {
      teamId: teamId,
      radioId: property.radio_id,
      visionId: property.vision_id,
      runningPlay: null,
      role: null,
      robots: {
        self: {},
        teammate: [],
        foes: []
      }
    }
  }

  async init () {
    // Initialize robots
    this.robots = {}
    for (let teamId in this.robotsProperties){
      for (let id in this.robotsProperties[teamId]) {
        console.log('RobotWorkers', 'start', 'robot :'+id, 'team :'+teamId)
        await this.startRobot(id, this.robotsProperties[teamId][id], teamId)
      }
    }

    for (let teamId in this.match.options.coaches){
      this.coaches[teamId] = new this.match.options.coaches[teamId]({match: this.match})
    }
    // Bind: Everytime vision detects something, call update inside
    this.dataManager.on('detection', this.update.bind(this))
  }

  // Calls update on all robots
  async update (data) {
    // Fix position and orientation based on side
    // Get team color
    let mainTeamSide = this.match.state.state.side
    let rivalTeamSide = mainTeamSide == 'right' ? 'left' : 'right'
    let sides = [mainTeamSide, rivalTeamSide]

    let mainTeamColor = this.match.state.state.team
    let rivalTeamColor = mainTeamColor == 'blue' ? 'yellow' : 'blue'
    // Iterare all robots
    let mainTeamRobots = []
    let rivalTeamRobots = []

    _.values(this.robots).map(robot => {
      // Find specific robot state
      let teamId = robot.teamId
      let teamData = data[sides[teamId]]
      if (teamId == 0) {
        mainTeamRobots.push(robot)
      } else {
        rivalTeamRobots.push(robot)
      }

      let teamColor = teamId == 0? mainTeamColor : rivalTeamColor
      let robotsPos = teamData['robots_' + teamColor]

      let detection = _.find(robotsPos, {robot_id: robot.visionId})
      // Set worker position and orientation
      if (detection) {
        robot.robots.self['position'] = {x: detection.x, y: detection.y}
        robot.robots.self['orientation'] = detection.orientation
        robot.robots.self['detection'] = detection
      }
      if (teamData) {
        robot.robots.self.frame = teamData
      }
    })

    await this.coaches[0].decide(data[sides[0]], mainTeamRobots)

    if (this.coaches.length > 1){
      await this.coaches[1].decide(data[sides[1]], rivalTeamRobots)
    }
    
    let promises = _.values(this.robots).map(robot => {
      let teamId = robot.teamId
      let teamData = data[sides[teamId]]
      let teamColor = teamId == 0? mainTeamColor : rivalTeamColor
      let robotsPos = teamData['robots_' + teamColor]

      let detection = _.find(robotsPos, {robot_id: robot.visionId})

      if (detection) {
        robot.runningPlay.position = {x: detection.x, y: detection.y}
        robot.runningPlay.orientation = detection.orientation
        robot.runningPlay.detection = detection
        robot.runningPlay.active = true
      } else {
        robot.runningPlay.active = false
      }
      if (teamData) {
        robot.runningPlay.frame = teamData
      }
      // Delegate update method to robots
      return robot.runningPlay.update()
    })

    // Wait all promises to finish
    Promise.all(promises).then(data => {
      this.dataManager.driver.send(data)
    })
  }
}
