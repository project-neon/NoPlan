exports.callOrReturn = function callOrReturn(value){
  return (typeof value === "function") ? value() : value
}

exports.applyReflectedDecay = function applyReflectedDecay(decayFn, value) {
  if (!decayFn) return value;

  let out = decayFn(Math.abs(value))

  // Re-reverse out function based on initial value
  return (value < 0 ? -out : out)
}