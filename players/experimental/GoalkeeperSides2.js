const TensorMath = require('../../lib/TensorMath')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const Vector = require('../../lib/Vector')
const RulePlays = require('./RulePlays')

const BASE_SPEED = 40
const MAX_SPEED = 80

const GOAL_LINE = -670

module.exports = class GoalkeeperSides2 extends RulePlays {
    setup(){
        super.setup()
        
        let crossbar = () => {
            let ballY = this.frame.cleanData.ball.y
            let side = ballY/Math.abs(ballY)
            return {x: GOAL_LINE - 15, y: side * 160}
          }

        // Fixar goleiro na linha do gol
        this.addIntetion(new LineIntention('KeepGoalLine', {
            target: {x: GOAL_LINE, y: 0},
            theta: Vector.direction("up"),
            lineSize: 1700,
            lineDist: 260,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED * 1.6
        }))
        // TODO:
        // CORRIGIR SMALL AREA PARA REPRESENTAR APENAS A PEQUENA AREA LATERAL
        // QUANDO FIZER ISSO TESTAR SE ELE AINDA PEGA CHUTES DA LATERAL PARA O MEIO
        // DEPOIS FAZER UMA TERCEIRA ESTRATEGIA PARA DO LADO OPOSTO DO CAAMPO O ROBO FIXAR NO CENTRO DO GOL
        // POR FIM UMA QUARTA PARA, QUANDO A BOLA ESTIVER MUITO PROXIMA DO GOL EMPURRAR
        this.addIntetion(new PointIntention('followCrossBall', {
            target: crossbar,
            radius: 150,
            radiusMax: false,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED
          }))


      }

      loop(){
      }
}
