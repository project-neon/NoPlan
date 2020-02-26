const TensorMath = require('../../lib/TensorMath')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const Vector = require('../../lib/Vector')
const RulePlays = require('./RulePlays')

const BASE_SPEED = 40
const MAX_SPEED = 80

const GOAL_LINE = -670

module.exports = class GoalkeeperKeep extends RulePlays {
    setup(){
        super.setup()
        
        // Fixar goleiro na linha do gol
        this.addIntetion(new LineIntention('KeepGoalLine', {
            target: {x: GOAL_LINE, y: 0},
            theta: Vector.direction("up"),
            lineSize: 1700, 
            lineDist: 260,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED * 1.6
        }))

        this.addIntetion(new PointIntention('followCrossBall', {
            target: {x: GOAL_LINE, y: 0},
            radius: 150,
            radiusMax: false,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED
          }))


      }

      loop(){
      }
}
