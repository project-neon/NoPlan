// const IntentionPlayer = require('../IntentionPlayer')
// const TensorMath = require('../../lib/TensorMath')
// const Intention = require('../../Intention')
// const LineIntention = require('../../Intention/LineIntention')
// const PointIntention = require('../../Intention/PointIntention')
// const LookAtIntention = require('../../Intention/LookAtIntention')
// const OrbitalIntention = require('../../Intention/OrbitalIntention')
// const Vector = require('../../lib/Vector')
// const RulePlays = require('./RulePlays')

// const BASE_SPEED = 65

// module.exports = class Attacker2Base extends RulePlays {
//     setup () {
//         super.setup()
//         let ballAntecipation = () => {
//             let ball = {x: this.match.dataManager.ball.x, y: this.match.dataManager.ball.y}
//             let ballToCenterGoal = Vector.sub({x: 700, y: 0}, ball)
//             let ballToCenterGoalNorm = Vector.norm(ballToCenterGoal)
//             let antecipation = {
//                 x: ballToCenterGoalNorm.x * 110,
//                 y: ballToCenterGoalNorm.y * 110
//             }
//             antecipation = {x: ball.x - antecipation.x, y: ball.y - antecipation.y}
//             return antecipation
//         }

//         let ball = () => {
//             let ball = {x: this.match.dataManager.ball.x, y: this.match.dataManager.ball.y}
//             return ball
//         }

//         this.addIntetion(new LineIntention('avoidFromOwnGoal', {
//             target: {x: -700, y: 0},
//             theta: Vector.direction("down"),
//             lineSize: 400, // Largura do segmento de reta
//             lineDist: 150, // Tamanho da repelência
//             lineDistMax: 150,
//             lineDistSingleSide: true,
//             decay: TensorMath.new.mult(-1).finish,
//             multiplier: 100
//         }))

//       }
//       loop(){
//       }
// }
