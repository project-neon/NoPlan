const plays = require('require-smart')('../plays')
const Role = require('./Role')
const Vector = require('../lib/Vector')

module.exports = class GoalKeeper extends Role {

	constructor(coach) {
		super(coach)

		this.plays = {
			'static_defend': new plays.GoalKeeperDefendPlay(coach),
			'lateral_defend': new plays.LateralGoalKeeperDefendPlay(coach),
			'advance_to_ball': new plays.AdvanceToBall(coach)
		}
	}

	define_play(match) {
		let play;

		let dist_ball_to_goal = Vector.distBetween(this.coach.ball, {x: this.Field.TopLeft.x, y: 0.0 })
		console.log(dist_ball_to_goal)
		if (dist_ball_to_goal < 300) {
			play = 'advance_to_ball'
		} else if (this.coach.ball.x < -260){ 
			play = 'lateral_defend'
		} else {
			play = 'static_defend'
		}
		console.log(play)

		return this.plays[play]
	}
}