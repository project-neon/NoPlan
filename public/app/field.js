// Matter.js module aliases
var Engine = Matter.Engine,
    World  = Matter.World,
    MouseConstraint = Matter.MouseConstraint,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

// NOTE: Values of VSS Field in centimeters
var fieldHeight = 130;
var fieldWidth  = 150;
var fieldFWidth = 170; //width with goal size in both sides
var fieldOffset =  10; // padding between field limits and canvas size

// NOTE: Canvas size in pixels
var canvasHeight = 600;
var canvasWidth  = fieldWidth*canvasHeight/fieldHeight;
var middleRadius = (40*canvasHeight/fieldHeight)/2;
var ballSize     = 4.27*canvasHeight/fieldHeight;

// create a Matter.js engine
var engine = Engine.create({
  render: {
    element: document.getElementById('showField'),
    controller: Matter.RenderPixi, //Uses Pixi.js as renderer
    options: {
      width: canvasWidth,
      height: canvasHeight
    }
  }
});

// NOTE: Create field points to create vector
var fieldVertices = [
  { x:  10, y:   0 }, //left-bottom corner
  { x: 160, y:   0 }, //right-bottom corner
  { x: 160, y:  45 }, //right goal-line (bottom)
  { x: 170, y:  45 }, //right goal-endline (bottom)
  { x: 170, y:  85 }, //right goal-endline (top)
  { x: 160, y:  85 }, //right goal-line (top)
  { x: 160, y: 130 }, //right-top corner
  { x:  10, y: 130 }, //left-top corner
  { x:  10, y:  85 }, //left goal-line (top)
  { x:   0, y:  85 }, //left goal-endline (top)
  { x:   0, y:  45 }, //left goal-endline (bottom)
  { x:  10, y:  45 }  //left goal-line (bottom)
];

// NOTE: Scales and loop to resize field array_size
var yScale = 590/130;
var xScale = (fieldWidth*590/fieldHeight)/170;
for(var i=0; i<fieldVertices.length; i++){
  fieldVertices[i].x *= xScale;
  fieldVertices[i].y *= yScale;
}

// NOTE: Create field limits body with Matter.Body
var fieldLimits = Body.create({
  position: { x: canvasWidth/2, y: canvasHeight/2 },
  vertices: fieldVertices,
  isStatic: true,
  label: 'FieldLimits'
});

// NOTE: Creates the ball
var fieldBall = Bodies.circle(canvasWidth/2, canvasHeight/2, ballSize/2);

// NOTE: add all of the bodies to the world
World.add(engine.world, MouseConstraint.create(engine));
World.add(engine.world, [fieldLimits, fieldBall]); // NOTE: NOT WORKING, ONLY SHOW THE FIELD LIMITS (STATIC ELEMENTS)
// World.add(engine.world, [fieldBall]); // NOTE: SHOW NON STATIC ELEMENTS (THE BALL)

// NOTE: Change world gravity on y axis to zero
engine.world.gravity.y = 0;

// NOTE: run the engine
Engine.run(engine);
