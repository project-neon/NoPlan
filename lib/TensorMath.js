class TensorMath {
  static get new () {
    return new TensorMath()
  }

  constructor () {
    this.operations = []
  }

  run (x) {
    return this.operations.reduce((anterior, op) => op(anterior), x)
  }

  sum (val) {
    this.operations.push(x => x + val)
    return this
  }

  sub (val) {
    this.operations.push(x => x - val)
    return this
  }

  mult (val) {
    this.operations.push(x => x * val)
    return this
  }

  div (val) {
    this.operations.push(x => x / val)
    return this
  }

  constant (val) {
    this.operations.push(x => val)
    return this
  }

  max (val) {
    this.operations.push(x => Math.max(x, val))
    return this
  }

  min (val) {
    this.operations.push(x => Math.min(x, val))
    return this
  }

  inverse () {
    this.operations.push(x => 1 / x)
    return this
  }

  pow (val = 2) {
    this.operations.push(x => Math.pow(x, val))
    return this
  }

  sqrt (val) {
    this.operations.push(x => Math.sqrt(x))
    return this
  }

  constant (val) {
    this.operations.push(x => val)
    return this
  }

  map (minIn, maxIn, minOut, maxOut) {
    this.operations.push(x => (x - minIn) * (maxOut - minOut) / (maxIn - minIn) + minOut)
    return this
  }

  deadWidth (w) {
    // w = w / 2
    this.operations.push(x => {
      if (x <= w) { return 0 }
      return x
    })
    return this
  }

  constrain (max, min = -max) {
    console.log('max:', max, 'min:', min)
    this.operations.push(x => x < 0 ? Math.max(x, min) : Math.min(x, max))
    return this
  }

  crop (max, min = -max) {
    this.operations.push(x => x < min ? 0 : (x > max ? 0 : x))
    return this
  }
  // Rampa de aceleração para se aproximar da bola
  sigmoid () {
    this.operations.push(x => (1/(1 + Math.exp(-(10*x -6)))))
    return this
  }

  sin () {
    this.operations.push(x => Math.sin(x))
    return this
  }

  toFixed (n) {
    this.operations.push(x => x.toFixed(n))
    return this
  }

  binarize (max) {
    this.operations.push(x => x < 0 ? -max : (x > 0 ? max : 0))
    return this
  }

  easeInOut () {
    this.operations.push(t => t * t * (3 - (2 * t)))
    return this
  }

  abs () {
    this.operations.push(x => Math.abs(x))
    return this
  }

  get finish () {
    return this.run.bind(this)
  }

  static buildTensor (start, end, step = 0.01) {
    let tensor = []
    for (let k = start; k < end; k += step) {
      tensor.push(k)
    }
    tensor.apply = (fn) => tensor.map(fn)
    return tensor
  }
}

module.exports = TensorMath
