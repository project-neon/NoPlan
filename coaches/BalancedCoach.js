const roles = require('require-smart')('../roles')
const Coach = require('../coaches/Coach')

module.exports = class BalancedCoach extends Coach {
	/*
		BalancedCoach:
		plays like 1-1-1
		goalkeeper, defender and attacker
		goalkeeper: first priority: nearest of the field goal
		attacker: second priority: nearest to Attack
		defender: the rest
	*/
	constructor(match) {
		super(match)
	}

	start_positions(match) {
		// Initialize the positions that will be consider by this Coach
		// Para inicializar a Intention (null, this.match, {predict: false})
		this.match = match
		this.attacker = new roles.Attacker(this)
		this.goalkeeper = new roles.GoalKeeper(this)
		this.defender = new roles.Defender(this)
		
		return [this.attacker, this.goalkeeper, this.defender]
	}

	decide_positions(workers) {
		// Define position for each robot assign the Intention Group
		// console.log(this.positions)
		
		// Decide the goalkeeper
		for(let id in this.positions) {
			this.positions[id].ball = workers[Object.keys(workers)[0]].ball
		}
		
		workers['robot_1'].intentionGroup = this.goalkeeper.define_play(this.match).intentionGroup
	}
}