const Intention = require('../Intention')

module.exports = class Play {
	constructor(coach) {
	    // Centers of your own goal and enemy goal
		console.log(this.coach)
		this.coach = coach

		this.Direction = {
		  UP: Math.PI / 2,
		  DOWN: - Math.PI / 2,
		  RIGHT: 0,
		  LEFT: Math.PI,
		}

		this.Field = {
	      width: 1700,
	      TopLeft: {x: -775, y: 675},
	      TopRight: {x: 775, y: 675},
	      BottomLeft: {x: -775, y: -675},
	      BottomRight: {x: 775, y: -675}
	    }

		this.CENTER_OWN_GOAL = -835
		this.CENTER_ENEMY_GOAL = 835

		// Self-explanatory
		this.MAX_ROBOT_SPEED=500

		this.intentionGroup = new Intention('root_intention')
	}
}