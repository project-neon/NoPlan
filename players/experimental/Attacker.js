const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const Intention = require('../../Intention')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const OrbitalIntention = require('../../Intention/OrbitalIntention')
const Vector = require('../../lib/Vector')
const RulePlays = require('./RulePlays')

const BASE_SPEED = 65

module.exports = class Attacker extends RulePlays {
    setup () {
        let ballAntecipation = () => {
            let ball = {x: this.match.dataManager.ball.x, y: this.match.dataManager.ball.y}
            let ballToCenterGoal = Vector.sub({x: 700, y: 0}, ball)
            let ballToCenterGoalNorm = Vector.norm(ballToCenterGoal)
            let antecipation = {
                x: ballToCenterGoalNorm.x * 130, 
                y: ballToCenterGoalNorm.y * 130
            }
            antecipation = {x: ball.x - antecipation.x, y: ball.y - antecipation.y}
            return antecipation
        }

        let ball = () => {
            let ball = {x: this.match.dataManager.ball.x, y: this.match.dataManager.ball.y}
            return ball
        }

        let ballSpeedBasedMultiplier = () => {
            let ballSpeed = Vector.size(this.match.dataManager.ball.speed)
            let multiplier = Math.max(Math.min(ballSpeed + 30, 80), 55)
            return multiplier
        }

        this.addIntetion(new PointIntention('goBall', {
            target: ballAntecipation,
            radius: 50,
            decay: TensorMath.new.finish,
            multiplier: ballSpeedBasedMultiplier,
        }))

        this.addIntetion(new LineIntention('avoidBallOwnGoal', {
            target: ball,
            theta: Vector.direction("down"),
            lineSize: 50, // Largura do segmento de reta
            lineDist: 180, // Tamanho da repelência
            lineDistMax: 200, // Tamanho da repelência
            lineDistSingleSide: true,
            decay: TensorMath.new.mult(-1).finish,
            multiplier: 55,
        }))

        this.addIntetion(new LineIntention('avoidBallOwnGoallateral', {
            target: ball,
            theta: Vector.direction("right"),
            lineSize: 400, // Largura do segmento de reta
            lineDist: 120, // Tamanho da repelência
            lineDistMax: 130, // Tamanho da repelência
            lineSizeSingleSide: true,
            decay: TensorMath.new.constant(1).mult(-1).finish,
            multiplier: 50,
        }))
        
      }
      loop(){
      }
}
