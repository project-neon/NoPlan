const TensorMath = require('../../lib/TensorMath')
const OrbitalIntention = require('../../Intention/OrbitalIntention')
const RulePlays = require('./RulePlays')

const BASE_SPEED = 50

module.exports = class AttackerMain extends RulePlays {
    setup(){
        super.setup()
        let ball = () => {
            return {
                x: this.frame.cleanData.ball.x, 
                y: this.frame.cleanData.ball.y
            }
        }

        let ballShiftedP = () => {
            let ball = {
                x: this.frame.cleanData.ball.x, 
                y: this.frame.cleanData.ball.y + 150
            }
            return ball
        }

        let ballShiftedN = () => {
            let ball = {
                x: this.frame.cleanData.ball.x, 
                y: this.frame.cleanData.ball.y - 150
            }
            return ball
        }

        // let clockwiseOrbit = () => {
        //     let ball = {
        //         x: this.frame.cleanData.ball.x, 
        //         y: this.frame.cleanData.ball.y
        //     }
        //     if (ball.y < 0) {
        //         return 1
        //     }
        //     else {
        //         return -1
        //     }
        // }

        this.orbitalRight = new OrbitalIntention('FollowBall', {
            target: ballShiftedN,
            clockwise: -1,
            radius: 75,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED
        })

        this.addIntetion(this.orbitalRight)

        this.orbitalLeft = new OrbitalIntention('FollowBall', {
            target: ballShiftedP,
            clockwise: 1,
            radius: 75,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED
        })

        this.addIntetion(this.orbitalLeft)
        
      }
      loop(){
        let ball = {
            x: this.frame.cleanData.ball.x, 
            y: this.frame.cleanData.ball.y
        }

        if (this.position.y > ball.y) {
            this.orbitalRight.weight = 0
            this.orbitalLeft.weight = 1
        } else {
            this.orbitalRight.weight = 1
            this.orbitalLeft.weight = 0
        }
      }
}
