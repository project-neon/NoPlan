// Matter.js module aliases
var Engine = Matter.Engine,
    World  = Matter.World,
    MouseConstraint = Matter.MouseConstraint,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

// NOTE: Values of VSS Field in centimeters
var fieldHeight = 140;
var fieldWidth  = 180;
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

var fieldBotPiece = Body.create({
  vertices: fieldBotVertices,
  position: Matter.Vertices.centre(fieldBotVertices),
  isStatic: true
});

var fieldTopPiece = Body.create({
  vertices: fieldTopVertices,
  position: Matter.Vertices.centre(fieldTopVertices),
  isStatic: true
});

var fieldTopLeftPiece = Body.create({
  vertices: fieldTopLeftVertices,
  position: Matter.Vertices.centre(fieldTopLeftVertices),
  isStatic: true
});

var fieldTopRightPiece = Body.create({
  vertices: fieldTopRightVertices,
  position: Matter.Vertices.centre(fieldTopRightVertices),
  isStatic: true
});

var fieldBottomLeftPiece = Body.create({
  vertices: fieldBottomLeftVertices,
  position: Matter.Vertices.centre(fieldBottomLeftVertices),
  isStatic: true
});

var fieldBottomRightPiece = Body.create({
  vertices: fieldBottomRightVertices,
  position: Matter.Vertices.centre(fieldBottomRightVertices),
  isStatic: true
});

var fieldGoalLeftPiece = Body.create({
  vertices: fieldGoalLeftVertices,
  position: Matter.Vertices.centre(fieldGoalLeftVertices),
  isStatic: true
});

var fieldGoalRightPiece = Body.create({
  vertices: fieldGoalRightVertices,
  position: Matter.Vertices.centre(fieldGoalRightVertices),
  isStatic: true
});

// NOTE: Creates the ball
var fieldBall = Bodies.circle(canvasWidth/2, canvasHeight/2, ballSize/2);

var fieldParts = [
                  fieldBotPiece,
                  fieldTopPiece,
                  fieldTopLeftPiece,
                  fieldTopRightPiece,
                  fieldBottomLeftPiece,
                  fieldBottomRightPiece,
                  fieldGoalLeftPiece,
                  fieldGoalRightPiece
                ]

// NOTE: add all of the bodies to the world
World.add(engine.world, MouseConstraint.create(engine));
World.add(engine.world, fieldParts);
World.add(engine.world, [fieldBall]);

// NOTE: Change world gravity on y axis to zero
engine.world.gravity.y = 0;

// NOTE: run the engine
Engine.run(engine);
