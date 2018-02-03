# Intentions

## LineIntention

Line intention is a Intention defined by a line. The field that brings the robot to the line is controlled by some params, those params are:

  - **target, theta**: The line intention is defined from a point and an angle.
  - **decay**: Is a param that defines the function that controls the intention ex: exponential field, constant field.
  - **lineSize**: Defines the line boundaries, the point that created the is the middle point of this .
  - **lineDist**: Distance to where the field decay works. From this point the field is always 1(full).
  - **lineDistMax**: Maximum distance to where the outer portion of the field works. From this point the field is 0(turned off).
  - **lineSizeSingleSide**: Boolean to use lineSize on only one side.
  - **lineDistSingleSide**: Boolean to make the field work on only one side.
  - **multiplier**: Multiplies output vectors.

To compute this intention we use the base vector from the robot to the target. The distance to the line is the x component of this vector (this is used for lineDist). The position of the robot on the line is the y component of this vector (this is used for lineSize).

>new LineIntention('exampleName', {
      target: {x,y} or function,
      theta: direction in radians,
      lineSize: size in cm, 
      lineDist: function work dist in cm,
      lineDistMax: max field work dist in cm,
      lineDistSingleSide: boolean,
      lineSizeSingleSide: boolean,
      decay: TensorMath.new.mult(-1).sum(1).finish,
      multiplier: value to multiply the normalized value, usually near 500,
    })

