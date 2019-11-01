const util = require('./util')

const FRESH_OUTPUT_TIME = 100
const MIN_WEIGHT_ACTIVE = 0.05
const STABILIZED_MIN_LINEAR = 30
const STABILIZED_MIN_ANGULAR = 0.5

module.exports = class Intention {
  constructor (name, params) {
    params = params || {}
    this.name = name
    this.time = 0
    this.weight = (params.weight == null ? 1 : params.weight)
    this.output = null
    this.intentions = []
  }

  addIntetion (intention) {
    if (this.intentions.includes(intention)) return
    this.intentions.push(intention)
    return intention
  }

  getIntentionInfo () {
    return this.intentions.map(x => x.getIntentionInfo())
  }

  isStabilized () {
    if (Date.now() > this.time + FRESH_OUTPUT_TIME) return false
    if (!this.output) return false
    if (!this.active) return false

    if (Math.abs(this.output.vx) > STABILIZED_MIN_LINEAR) return false
    if (Math.abs(this.output.vy) > STABILIZED_MIN_LINEAR) return false
    if (Math.abs(this.output.vtheta) > STABILIZED_MIN_ANGULAR) return false

    return true
  }

  get active () {
    return this.weight > MIN_WEIGHT_ACTIVE
  }

  compute (input) {
    let outputSum = {vx: 0, vy: 0, vtheta: 0}
    let outputSumWeight = 0

    for (let intention of this.intentions) {
      if (!intention.active) continue

      let weight = util.callOrReturn(intention.weight)
      let output = intention.compute(input)

      intention.output = output
      if (!output) {
        console.log('Fudeo o role:', intention.name, 'com: ', output)
        continue
      }

      outputSumWeight += weight
      for (let key in outputSum) {
        outputSum[key] += output[key] * Math.min(1, Math.max(0, weight))
      }
    }

    if (outputSumWeight <= MIN_WEIGHT_ACTIVE) {
      outputSum = {vx: 0, vy: 0, vtheta: 0}
    }

    this.time = Date.now()
    this.output = outputSum

    return outputSum
  }
}
