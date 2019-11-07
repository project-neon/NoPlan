const EventEmitter = require('events')

module.exports = class StateManager extends EventEmitter {
  constructor (initialState) {
    super()
    this._state = initialState
  }

  setState (object) {
    for (let key in object) {
      this._state[key] = object[key]
    }
    this.emit('change', this._state)
  }

  get state () {
    return this._state
  }
}
