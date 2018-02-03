exports.callOrReturn = function callOrReturn(value){
  return (typeof value === "function") ? value() : value
}

exports.applyReflectedDecay = function applyReflectedDecay(decayFn, value) {
  if (!decayFn) return value;

  let out = decayFn(Math.abs(value))

  // Re-reverse out function based on initial value
  return (value < 0 ? -out : out)
}

exports.mapDict = function mapDict(o, f, ctx) {
    ctx = ctx || this;
    var result = {};
    Object.keys(o).forEach(function(k) {
        result[k] = f.call(ctx, o[k], k, o); 
    });
    return result;
}