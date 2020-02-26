const Vector = require('../../lib/Vector')
const TensorMath = require('../../lib/TensorMath')
const OrbitalIntention = require('../../Intention/OrbitalIntention')
const PointIntention = require('../../Intention/PointIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const LineIntention = require('../../Intention/LineIntention')

const RulePlays = require('./RulePlays')
const BASE_SPEED = 50

module.exports = class AttackerHold extends RulePlays {
    setup () {
        super.setup()
        let ballProjection = () => {
          return {
              x: -200,
              y: this.frame.cleanData.ball.y * 2
          }
        }

        this.addIntetion(new PointIntention('KeepOnBall', {
            target: ballProjection,
            radius: 110,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED
        }))

        // Impedir bater na parede
        this.avoidFieldWalls1 = new LineIntention('avoidFieldWalls', {
            target: {x:0, y: 610},
            theta: Vector.direction("left"),
            lineSize: 1700,
            lineDist: 30,
            lineDistMax: 30,
            decay: TensorMath.new.sum(1).mult(-1).finish,
            multiplier: BASE_SPEED * 2
        })

        this.addIntetion(this.avoidFieldWalls1)

        // Impedir bater na parede
        this.avoidFieldWalls2 = new LineIntention('avoidFieldWalls', {
            target: {x:0, y: -610},
            theta: Vector.direction("left"),
            lineSize: 1700,
            lineDist: 30,
            lineDistMax: 30,
            decay: TensorMath.new.sum(1).mult(-1).finish,
            multiplier: BASE_SPEED * 2
        })
        this.addIntetion(this.avoidFieldWalls2)

      }
      loop () {
        let ball = {
          x: this.frame.cleanData.ball.x,
          y: this.frame.cleanData.ball.y
        }
      }
}
