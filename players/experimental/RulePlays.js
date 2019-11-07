const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const Intention = require('../../Intention')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const Vector = require('../../lib/Vector')

module.exports = class RulePlays extends IntentionPlayer {
    setup () {
        this.addIntetion(new LineIntention('avoidFromGoal', {
            target: {x: 820, y: 0},
            theta: Vector.direction("up"),
            lineSize: 400, // Largura do segmento de reta
            lineDist: 150, // Tamanho da repelência
            lineDistMax: 150,
            lineDistSingleSide: true,
            decay: TensorMath.new.mult(-1).finish,
            multiplier: 100
        }))

        this.addIntetion(new LineIntention('avoidFromGoalLateral', {
            target: {x:820, y: 0},
            theta: Vector.direction("right"),
            lineSize: 120, // Largura do segmento de reta
            lineDist: 200, // Tamanho da repelência
            lineDistMax: 200,
            decay: TensorMath.new.finish,
            multiplier: 100
        }))

        this.addIntetion(new LineIntention('avoidFromOwnGoal', {
          target: {x: -820, y: 0},
          theta: Vector.direction("down"),
          lineSize: 400, // Largura do segmento de reta
          lineDist: 120, // Tamanho da repelência
          lineDistMax: 120,
          lineDistSingleSide: true,
          decay: TensorMath.new.mult(-1).finish,
          multiplier: 150
      }))

      this.addIntetion(new LineIntention('avoidFromGoalOwnLateral', {
          target: {x:-820, y: 0},
          theta: Vector.direction("right"),
          lineSize: 120, // Largura do segmento de reta
          lineDist: 200, // Tamanho da repelência
          lineDistMax: 200,
          decay: TensorMath.new.finish,
          multiplier: 150
      }))
    }
    loop () {}
}
