# Intentions

The concept of `intentions` is used to create all of the fields on the match. A composition of line, point and theta intentions creates the robot's behavior.

## LineIntention

`lineIntention` is a Intention defined by a line. The field that brings the robot to the line is controlled by some params, those params are:

  - **target, theta**: The line intention is defined from a point and an angle.
  - **decay**: Is a param that defines the function that controls the intention ex: exponential field, constant field.
  - **lineSize**: Distance in mm from the middle(). Defines the line boundaries, the point that created the is the middle point of this .
  - **lineDist**: Distance to where the field decay works. From this point the field is always 1(full).
  - **lineDistMax**: Maximum distance to where the outer portion of the field works. From this point the field is 0(turned off).
  - **lineSizeSingleSide**: Boolean to use lineSize on only one side.
  - **lineDistSingleSide**: Boolean to make the field work on only one side.
  - **multiplier**: Multiplies output vectors.

To compute this intention we use the base vector from the robot to the target. The distance to the line is the x component of this vector (this is used for lineDist). The position of the robot on the line is the y component of this vector (this is used for lineSize).

```javascript
new LineIntention('exampleName', {
  target: {x,y} or function,
  theta: direction in radians,
  lineSize: size in cm, 
  lineDist: field work dist in cm,
  lineDistMax: max field work dist in cm,
  lineDistSingleSide: boolean,
  lineSizeSingleSide: boolean,
  decay: TensorMath.new.mult(-1).sum(1).finish,
  multiplier: value to multiply the normalized value, usually near 500,
})
```

## PointIntention

`pointIntention` is the field to get to a certain point on the soccer field. This field is controlled by some params as:

  - **target**: The point intention requires a coordinate object with X and Y.
  - **decay**: Is a param that defines the function that controls the intention field ex: exponential field, constant field.
  - **radius**: Distance to where the field decay works. From this point the field is always 1(full).
  - **radiusMax**: Maximum distance to where the outer portion of the field works. From this point the field is 0(turned off).
  - **multiplier**: Multiplies output vectors.

To compute this intention we use the base vector from the robot to the target.

```javascript
new PointIntention('goBall', {
  target: function() or coordinate object,
  radius: field work distance in cm,
  radiusMax: max field work dist in cm,
  decay: TensorMath.new.constant(1).finish,
  multiplier: value to multiply the normalized value, usually near 500,
})
```

## LookAtIntention

`lookAtIntention` is the intention to make turns to a certain point on the field. The params are:

  - **target**: The look at intention requires point (coordinate object with X and Y) or a theta to keep pointing at.
  - **decay**: Is a param that defines the function that controls the intention field ex: exponential field, constant field.
  - **multiplier**: Multiplies output vectors.

Receiving the theta from the robot we can compute and run the decay function over the diference between actual angle and desired angle. `THIS ONLY WORKS WHEN LINEAR SPEED IS UNDER SOME THRESHOLD`.

```javascript
new LookAtIntention('lookUp', {
  target: function() or coordinate object, 
  theta: Value in radians,
  decay: TensorMath.new.finish,
  multiplier: Multiplier value, usually 10,
})


