module.exports = function Deferred() {
  var self = this;
  this.promise = new Promise(function(resolve, reject) {
    self.reject = reject
    self.resolve = resolve
  })
}