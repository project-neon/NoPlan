// 
// Vector Utils
//
var Vector = {};

const PI = Math.PI
const TWO_PI = PI * 2

Vector.sum = function (v1, v2){
	return {x:(v1.x + v2.x), y:(v1.y + v2.y)}
}

Vector.sub = function (v1, v2){
	return {x:(v1.x - v2.x), y:(v1.y - v2.y)}
}

// Oposite
Vector.mult = function (v1, c) {
	return {x:(v1.x * c), y:(v1.y * c)}
}

// Oposite
Vector.div = function (v1, c) {
	return { x:(v1.x / c), y:(v1.y / c)}
}

// Normalize
Vector.norm = function (v1) {
	var l = Math.sqrt(Math.pow(v1.x, 2) + Math.pow(v1.y, 2))

	if(l == 0.0)
		return {x:0,y:0}

	return {x:(v1.x / l), y:(v1.y / l)};
}

// Create vector from theta
Vector.fromTheta = function (theta){
	return {x:Math.cos(theta), y:Math.sin(theta)}
}

Vector.size = function (v){
	return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2))
}

Vector.angle = function (v) {
	return Math.atan2(v.x, v.y);
}

Vector.angleBetween = function(v1, v2){
	return Vector.normalRelativeAngle(Vector.angle(v2)-Vector.angle(v1))
}

// Vector.relative = function(a){
// 	while(a >  180) a = a - 360;
// 	while(a < -180) a = a + 360;
// 	return a	
// }

Vector.normalRelativeAngle = function (angle) {
	return (angle %= TWO_PI) >= 0 ? (angle < PI) ? angle : angle - TWO_PI : (angle >= -PI) ? angle : angle + TWO_PI;
}

// Normalize
Vector.rotate = function (v, theta) {
	var currentTheta = Math.atan2(v.x, v.y)
	var currentNorm = Math.sqrt(v.x*v.x + v.y*v.y)

	// Creates vector with new Angle
	var vect = Vector.fromTheta(currentTheta + theta)

	// Un-normalize vector
	return Vector.mult(vect, currentNorm)
}

Vector.toDegrees = function (rads) {
	return rads * (180/Math.PI);
}

Vector.toRadians = function (degs) {
	return degs * (Math.PI/180)
}

module.exports = Vector;
