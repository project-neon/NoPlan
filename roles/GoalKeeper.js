const plays = require('require-smart')('../plays')
const Role = require('./Role')

module.exports = class GoalKeeper extends Role {

	constructor(coach) {
		super(coach)
		this.defend_play = new plays.GoalKeeperDefendPlay(coach)
		this.lateral_defend_play = new plays.LateralGoalKeeperDefendPlay(coach)
		this.advance_to_ball = new plays.AdvanceToBall(coach)

		this.plays = {
			'static_defend': this.defend_play,
			'lateral_defend': this.lateral_defend_play,
			'advance_to_ball': this.advance_to_ball
		}
	}

	define_play(match) {
		let play;
		if (this.coach.ball.x < -280) {
			play = 'advance_to_ball'
		} else if (this.coach.ball.x < -200){ 
			play = 'lateral_defend'
		} else {
			play = 'static_defend'
		}
		console.log(play)

		return this.plays[play]
	}
}