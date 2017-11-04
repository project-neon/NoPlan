module.exports = class Intention {
  constructor(name) {
    this.name = name
    this.weight = 1
    this.lastOutput = null
    this.intentions = []
  }

  addIntetion(intention) {
    // Avoid same object twice in list
    if (this.intentions.includes(intention))
      return;

    this.intentions.push(intention)
  }

  compute(input) {
    let outputSumValues = {vx: 0, vy: 0, vtheta: 0}
    let outputSumWeight = 0

    for (let intention of this.intentions) {
      let output = intention.compute(input)
      intention.lastOutput = output

      if (!output) {
        console.log('Fudeo o role:', intention.name, 'com: ', output)
        continue;
      }

      for (let key in outputSumValues) {
        outputSumValues[key] += output[key] * intention.weight
        outputSumWeight += intention.weight
      }
    }

    // Make sure weights are ok, or return nothing
    if (outputSumWeight <= 0.000000001) {
      return {vx: 0, vy: 0, vtheta: 0}
    }

    // Divide all values by their weights
    for(let key in outputSumValues) {
      outputSumValues[key] /= outputSumWeight
    }

    return outputSumValues
  }
}