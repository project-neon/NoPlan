const Vector = require('../../lib/Vector')
const TensorMath = require('../../lib/TensorMath')
const PointIntention = require('../../Intention/PointIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const LineIntention = require('../../Intention/LineIntention')

const RulePlays = require('./RulePlays')

const BASE_SPEED = 65

let robot_saw_the_ball_multiplier = 1.3

module.exports = class AttackerConduct extends RulePlays {
    setup(){
        super.setup()
        let ball = () => {
            
            return {
                x: this.frame.cleanData.ball.x, 
                y: this.frame.cleanData.ball.y
            }
        }

        let ballToGoalNormal = () => {
            let b = this.frame.cleanData.ball
            let c = {x: 680, y: 0}

            let ballToGoal = Vector.sub(b, c)

            // Vector normal
            ballToGoal = Vector.norm({x: ballToGoal.x, y: -ballToGoal.y})
            
            return Vector.angle(ballToGoal)
        }

        this.addIntetion(new PointIntention('KeepOnBall', {
            target: ball,
            radius: 110,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED
        }))

        this.addIntetion(new LineIntention('ConductBall', {
            target: ball,
            theta: ballToGoalNormal,
            lineSize: 75,
            lineSizeMax: 75,
            lineDist: 100,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED * robot_saw_the_ball_multiplier
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

        this.lookToBall = new LookAtIntention('look_to_ball', {
            target: ball,
            decay: TensorMath.new.pow(1/2).finish,
            multiplier: 640
        })
        this.addIntetion(this.lookToBall)
      }
      loop(){
    }

}
