const TensorMath = require('../../lib/TensorMath')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const RulePlays = require('./RulePlays')
const Vector = require('../../lib/Vector')

const BASE_SPEED = 40
const GOAL_LINE = -670

module.exports = class GoalkeeperPush2 extends RulePlays {
    setup(){
        super.setup()
        let ball = () => {
            let ball = {x: this.frame.cleanData.ball.x, y: this.frame.cleanData.ball.y}
            return ball
        }

        // Fixar goleiro na linha do gol
        this.addIntetion(new LineIntention('KeepGoalLine', {
            target: {x: GOAL_LINE, y: 0},
            theta: Vector.direction("up"),
            lineSize: 1700,
            lineDist: 260,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED
        }))

        //Mantem o goleiro fixado na bola, seguindo eixo Y
        this.addIntetion(new LineIntention('KeepOnBall', {
            target: ball,
            theta: Vector.direction("left"),
            lineSize: 1700,
            lineDist: 250,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED * 1.2
        }))

        /*
        Correção na função para o goleiro ter mais velocidade
        em casos de bola muito proxima do eixo Y
        */
        this.addIntetion(new LineIntention('KeepOnBall', {
            target: ball,
            theta: Vector.direction("left"),
            lineSize: 400,
            lineDist: 150,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED * 1.2
        }))

       this.addIntetion(new PointIntention('PushBall', {
            target: ball,
            radius: 50,
            radiusMax: 50,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED * 1.8
        }))
    }

    loop(){

    }
}
