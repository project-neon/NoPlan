const EventEmitter = require('events')
const Vector = require('./Vector')

module.exports = class DataManager extends EventEmitter {
  constructor (match) {
    super()
    this.match = match
    this.robots = null
    this.coach = null

    this.frameHistory = {
      size: 15,
      frames: []
    }

    this.visionParams = match.options.vision.params
    this.driverParams = match.options.driver.params
  }

  getBallProjection (goalLine = -630) {
    let ballPos = {x: this.ball.x, y: this.ball.y}
    let ballSpeed = this.ball.speed
    let ballDir = Vector.norm(ballSpeed)
    let BallAngle = Math.abs(Vector.angle(ballDir))
    let ballProjectY = -1 * (ballDir.y / Math.abs(ballDir.y)) * Math.tan(BallAngle) * Math.abs(ballPos.x - goalLine) + ballPos.y

    return {x: goalLine, y: ballProjectY}
  }

  emitVision (frame) {
    let data = frame
    let side = this.match.state.state.side
    data = this.fixFrame(data, side)
    this.updateFrameHistory(frame)

    data['cleanData'] = {}
    // TODO quando houverem mais tratamentos fazer algo mais elaborado

    if (data.balls.length > 0) {
      data['cleanData']['ball'] = {
        'x': data.balls[0]['x'],
        'y': data.balls[0]['y'],
        'speed': this.calculateBallSpeed()
      }

      this.ball = data['cleanData']['ball']
      if (this.frameHistory.frames.length > 1) {
        let ballProjection = this.getBallProjection()
        this.ball['projection'] = ballProjection
      }
    }

    this.emit('detection', data)
  }

  updateFrameHistory (frame) {
    if (frame.balls.length === 0) return
    // Ponto final no cálculo do vetor é a primeira posição do array
    if (this.frameHistory.frames.length === this.frameHistory.size) {
      this.frameHistory.frames.pop()
      this.frameHistory.frames.unshift(frame)
    } else {
      this.frameHistory.frames.unshift(frame)
    }
  }
  calculateBallSpeed () {
    if (this.frameHistory.frames.length <= 1) return
    // TODO: zip e clone poderiam estar num arquivo de metodos uteis
    let zip = (rows) => rows[0].map((_, c) => rows.map(row => row[c]))

    let clone = (obj) => {
      if (obj == null || typeof obj !== 'object') return obj
      var copy = obj.constructor()
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr]
      }
      return copy
    }
    let frameHistoryShifted = clone(this.frameHistory.frames)
    frameHistoryShifted.shift()
    let zipFrames = zip([this.frameHistory.frames, frameHistoryShifted])
    zipFrames.pop()

    let speeds = []
    for (let pairs in zipFrames) {
      let ballPosF = {
        x: zipFrames[pairs][0].balls[0].x,
        y: zipFrames[pairs][0].balls[0].y
      }
      let ballPosI = {
        x: zipFrames[pairs][1].balls[0].x,
        y: zipFrames[pairs][1].balls[0].y
      }

      const deltaPos = {x: ballPosF.x - ballPosI.x, y: ballPosF.y - ballPosI.y}

      let frameTimeF = zipFrames[pairs][0].t_capture
      let frameTimeI = zipFrames[pairs][1].t_capture
      const deltaTime = (frameTimeF - frameTimeI) * 10 // to Seconds
      const speed = {
        x: (deltaPos.x) / deltaTime,
        y: (deltaPos.y) / deltaTime
      }
      speeds.push(speed)
    }
    speeds.shift()
    let finalSpeed = speeds.reduce(function (a, b) { return {x: a.x + b.x, y: a.y + b.y} }, {x: 0, y: 0})
    finalSpeed = {x: finalSpeed.x / speeds.length, y: finalSpeed.y / speeds.length}
    return finalSpeed
  }

  fixFrame (frame, side) {
    // Fix position and orientation from robots and ball:
    // Position just multiply by -1 (since the center of the field is the origin)
    // Orientation just sum PI (a 180 degrees rotation)
    if (side === 'left') {
      let yellowTeam = frame['robots_yellow']
      let blueTeam = frame['robots_blue']
      let balls = frame['balls']
      if (blueTeam.length > 0) {
        for (let robot in blueTeam) {
          blueTeam[robot]['x'] *= -1
          blueTeam[robot]['y'] *= -1
          blueTeam[robot]['orientation'] += Math.PI
        }
      }
      if (yellowTeam.length > 0) {
        for (let robot in yellowTeam) {
          yellowTeam[robot]['x'] *= -1
          yellowTeam[robot]['y'] *= -1
          yellowTeam[robot]['orientation'] += Math.PI
        }
      }
      if (balls.length > 0) {
        for (let ball in balls) {
          balls[ball]['x'] *= -1
          balls[ball]['y'] *= -1
        }
      }
      frame['robots_yellow'] = yellowTeam
      frame['robots_blue'] = blueTeam
      frame['balls'] = balls
    }
    return frame
  }
}
