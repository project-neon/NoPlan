// 
// Vector Utils
//
var Vector = {};

Vector.sum = function (v1, v2){
	return [v1[0] + v2[0], v1[1] + v2[1]];
}

Vector.sub = function (v1, v2){
	return [v1[0] - v2[0], v1[1] - v2[1]];
}

// Oposite
Vector.mult = function (v1, c) {
	return [v1[0] * c, v1[1] * c];
}

// Oposite
Vector.div = function (v1, c) {
	return [v1[0] / c, v1[1] / c];
}

// Normalize
Vector.norm = function (v1) {
	var l = Math.sqrt(Math.pow(v1[0], 2) + Math.pow(v1[1], 2));

	if(l == 0.0)
		return [0,0];

	return [v1[0] / l, v1[1] / l];
}

// Create vector from theta
Vector.fromTheta = function (theta){
	return [Math.cos(theta), Math.sin(theta)];
}

Vector.size = function (v){
	return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
}

Vector.angle = function (v) {
	return Math.atan2(v[0], v[1]);
}

// Normalize
Vector.rotate = function (v, theta) {
	var currentTheta = Math.atan2(v[0], v[1]);
	var currentNorm = Math.sqrt(v[0]*v[0] + v[1]*v[1]);

	// Creates vector with new Angle
	var vect = Vector.fromTheta(currentTheta + theta);

	// Un-normalize vector
	return Vector.mult(vect, currentNorm);
}

Vector.toDegrees = function (rads) {
	return rads * (180/Math.PI);
};

Vector.toRadians = function (degs) {
	return degs * (Math.PI/180);
};

module.exports = Vector;
