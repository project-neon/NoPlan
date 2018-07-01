module.exports = class Role {
	constructor(coach) {
		this.plays = []
		this.coach = coach

		this.Field = {
		  width: 1700,
		  TopLeft: {x: -775, y: 675},
		  TopRight: {x: 775, y: 675},
		  BottomLeft: {x: -775, y: -675},
		  BottomRight: {x: 775, y: -675}
		}
	}

	define_play() {}
}