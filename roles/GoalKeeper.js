const plays = require('require-smart')('../plays')
const Role = require('./Role')

module.exports = class GoalKeeper extends Role {

	constructor(coach) {
		super(coach)
		this.defend_play = new plays.GoalKeeperDefendPlay(coach)
		this.plays = {
			'static_defend': this.defend_play
			// 'lateral_defend': this.lateral_defend_play
		}
	}

	define_play(match) {
		return this.plays['static_defend']
	}

}