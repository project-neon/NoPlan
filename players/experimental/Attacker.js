const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const Intention = require('../../Intention')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const OrbitalIntention = require('../../Intention/OrbitalIntention')
const Vector = require('../../lib/Vector')

const BASE_SPEED = 50

module.exports = class GoalkeeperMain extends IntentionPlayer {
    setup () {
        let ballAntecipation = () => {
            let ball = {x: this.match.dataManager.ball.x, y: this.match.dataManager.ball.y}
            return {x: ball.x - 130, y: ball.y}
        }

        let ball = () => {
            let ball = {x: this.match.dataManager.ball.x, y: this.match.dataManager.ball.y}
            return ball
        }

        this.addIntetion(new PointIntention('goBall', {
            target: ballAntecipation,
            radius: 150,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED,
        }))
        
        // this.addIntetion(new PointIntention('avoidBall', {
        //     target: ball,
        //     radius: 100,
        //     radiusMax: 160,
        //     decay: TensorMath.new.mult(-1).finish,
        //     multiplier: BASE_SPEED * 2,
        // }))

        // this.addIntetion(new LineIntention('goToSideBall', {
        //     target: ball,
        //     theta: Vector.direction("up"),
        //     lineSize: 160,
        //     lineDist: 100,
        //     lineDistMax: 160,
        //     lineSizeSingleSide: true,
        //     decay: TensorMath.new.finish,
        //     multiplier: BASE_SPEED * 2
        //   }))

        this.addIntetion(new LineIntention('avoidBallOwnGoal', {
            target: ball,
            theta: Vector.direction("down"),
            lineSize: 50, // Largura do segmento de reta
            lineDist: 180, // Tamanho da repelência
            lineDistMax: 200, // Tamanho da repelência
            lineDistSingleSide: true,
            decay: TensorMath.new.mult(-1).finish,
            multiplier: 45,
        }))

        this.addIntetion(new LineIntention('avoidBallOwnGoallateral', {
            target: ball,
            theta: Vector.direction("right"),
            lineSize: 400, // Largura do segmento de reta
            lineDist: 150, // Tamanho da repelência
            lineDistMax: 160, // Tamanho da repelência
            lineSizeSingleSide: true,
            decay: TensorMath.new.constant(1).mult(-1).finish,
            multiplier: 40,
        }))
        
      }
      loop(){
      }
}
