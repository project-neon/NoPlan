const TensorMath = require('../../lib/TensorMath')
const Intention = require('../../Intention')
const LineIntention = require('../../Intention/LineIntention')
const Vector = require('../../lib/Vector')
const RulePlays = require('./RulePlays')

const BASE_SPEED = 60
module.exports = class GoalkeeperPush extends RulePlays {
    setup(){
        super.setup()

        this.$projectBall = new Intention()

        this.$projectBall.addIntetion(new LineIntention('followBallProjection', {
            target: ballProjection,
            theta: Vector.direction("left"),
            lineSize: 1700,
            lineDist: 125,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED
        }))
        this.addIntetion(this.$projectBall)
    }
    loop(){}
}
